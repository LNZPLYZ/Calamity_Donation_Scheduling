const User = require('../models/userModel')
const { hashPassword, verifyPassword } = require('../utils/passwordUtils')

// Create a donor account after validating the submitted profile and credentials.
const signup = async (req, res, next) => {
    const body = req.body ?? {}
    const {
        first_name,
        middle_name,
        last_name,
        suffix,
        birth_date,
        gender,
        contact_number,
        house_number,
        street,
        barangay,
        city_municipality,
        province,
        postal_code,
        email,
        password,
    } = body

    if (
        typeof first_name !== 'string' ||
        typeof last_name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof contact_number !== 'string' ||
        typeof birth_date !== 'string' ||
        !first_name.trim() ||
        !last_name.trim() ||
        !email.trim() ||
        !contact_number.trim() ||
        !/^\d{4}-\d{2}-\d{2}$/.test(birth_date) ||
        Number.isNaN(Date.parse(`${birth_date}T00:00:00.000Z`)) ||
        new Date(`${birth_date}T00:00:00.000Z`).toISOString().slice(0, 10) !== birth_date ||
        !['Male', 'Female'].includes(gender) ||
        password.length < 8 ||
        password.length > 1024 ||
        email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return res.status(400).json({ error: 'Please provide valid signup information' })
    }

    try {
        const normalizedEmail = email.trim().toLowerCase()
        const existingUser = await User.findOne({ email: normalizedEmail })

        if (existingUser) {
            return res.status(409).json({ error: 'An account with this email already exists' })
        }

        const user = await User.create({
            first_name: first_name.trim(),
            middle_name: typeof middle_name === 'string' ? middle_name.trim() : '',
            last_name: last_name.trim(),
            suffix: typeof suffix === 'string' ? suffix.trim() : '',
            birth_date: new Date(`${birth_date}T00:00:00.000Z`),
            gender,
            email: normalizedEmail,
            password_hash: await hashPassword(password),
            contact_number: contact_number.trim(),
            house_number: typeof house_number === 'string' ? house_number.trim() : '',
            street: typeof street === 'string' ? street.trim() : '',
            barangay: typeof barangay === 'string' ? barangay.trim() : '',
            city_municipality:
                typeof city_municipality === 'string' ? city_municipality.trim() : '',
            province: typeof province === 'string' ? province.trim() : '',
            postal_code: typeof postal_code === 'string' ? postal_code.trim() : '',
            // Public signup must not let the requester choose an elevated role.
            role: 'Donor',
            account_status: 'Active',
        })

        res.status(201).json({
            message: 'Account created successfully',
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        // The unique email index also protects against two simultaneous signups.
        if (error.code === 11000) {
            return res.status(409).json({ error: 'An account with this email already exists' })
        }
        next(error)
    }
}

// Check credentials and return only the profile fields safe for the frontend.
const login = async (req, res, next) => {
    const { email, password } = req.body ?? {}

    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password ||
        email.length > 254 ||
        password.length > 1024
    ) {
        return res.status(400).json({ error: 'A valid email and password are required' })
    }

    try {
        const user = await User.findOne({ email: email.trim().toLowerCase() })

        // Use the same response for unknown users, wrong passwords, and inactive accounts.
        if (
            !user ||
            user.account_status !== 'Active' ||
            !(await verifyPassword(password, user.password_hash))
        ) {
            return res.status(401).json({ error: 'Email or password is incorrect' })
        }

        res.status(200).json({
            message: 'Sign in successful',
            user: {
                _id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { login, signup }
