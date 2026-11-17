const mongoose = require('mongoose')
const Donation = require('../models/donationModel')
const DonationItem = require('../models/donationItemModel')
const User = require('../models/userModel')
const Calamity = require('../models/calamityModel')
const Transaction = require('../models/transactionModel')

// Only these donation properties are accepted from create and update requests.
// The whitelist prevents unrelated request fields from being saved to a donation.
const donationFields = [
    'donor_id',
    'calamity_id',
    'pickup_house_number',
    'pickup_street',
    'pickup_barangay',
    'pickup_city_municipality',
    'pickup_province',
    'pickup_postal_code',
    'donation_date',
    'donation_status',
    'remarks',
]

// Replace donor and calamity IDs with a small set of display fields in API results.
const populateDonation = (query) => query
    .populate('donor_id', 'first_name last_name email')
    .populate('calamity_id', 'calamity_name')

// Donation items live in their own collection, so fetch and group them by donation ID.
const attachItems = async (donations) => {
    const donationIds = donations.map((donation) => donation._id)
    const items = await DonationItem.find({ donation_id: { $in: donationIds } }).lean()
    const itemsByDonationId = new Map()

    // Build a lookup once so each donation can be paired with its items.
    for (const item of items) {
        const donationItems = itemsByDonationId.get(item.donation_id) ?? []
        donationItems.push(item)
        itemsByDonationId.set(item.donation_id, donationItems)
    }

    return donations.map((donation) => ({
        ...donation,
        items: itemsByDonationId.get(donation._id) ?? [],
    }))
}


const getDonations = async (req, res, next) => {
    try {
        // Newest donations appear first; lean() returns plain objects for read-only results.
        const donations = await populateDonation(
            Donation.find({}).sort({ created_at: -1 }),
        ).lean()
        // Items are stored separately, so include them in the response explicitly.
        res.status(200).json(await attachItems(donations))
    } catch (error) {
        next(error)
    }
}

const getDonation = async (req, res, next) => {
    try {
        // Use the URL ID to find one record and populate display names for related records.
        const donation = await populateDonation(Donation.findById(req.params.id)).lean()

        if (!donation) {
            return res.status(404).json({ error: 'No such donation' })
        }

        res.status(200).json((await attachItems([donation]))[0])
    } catch (error) {
        next(error)
    }
}

const createDonation = async (req, res, next) => {
    // Keep donation properties separate from items, which use their own model/collection.
    const { items, ...body } = req.body ?? {}
    // Ignore fields the API does not explicitly allow to be written.
    const donationData = Object.fromEntries(
        Object.entries(body).filter(([field]) => donationFields.includes(field)),
    )

    // Validate basic request structure before querying MongoDB.
    if (typeof donationData.donor_id !== 'string' || !donationData.donor_id.trim()) {
        return res.status(400).json({ error: 'A donor ID is required' })
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'A donation must include at least one item' })
    }
    donationData.donor_id = donationData.donor_id.trim()

    try {
        // A donation must belong to a real, active user whose role is Donor.
        const donor = await User.findOne({
            _id: donationData.donor_id,
            role: 'Donor',
            account_status: 'Active',
        })

        if (!donor) {
            return res.status(400).json({ error: 'An active donor user is required' })
        }

        if (donationData.calamity_id) {
            // Confirm an optional calamity reference exists before saving the donation.
            const calamity = await Calamity.exists({ _id: donationData.calamity_id })
            if (!calamity) {
                return res.status(400).json({ error: 'The selected calamity does not exist' })
            }
        } else {
            delete donationData.calamity_id
        }

        const session = await mongoose.startSession()
        let donation

        try {
            // Save the donation and all its items together, or roll back the whole operation.
            await session.withTransaction(async () => {
                donation = new Donation(donationData)
                await donation.save({ session })
                await DonationItem.insertMany(
                    items.map((item) => ({
                        ...item,
                        donation_id: donation._id,
                    })),
                    { session },
                )
            })
        } finally {
            await session.endSession()
        }

        // Return the same enriched response shape used by the read endpoints.
        const createdDonation = await populateDonation(
            Donation.findById(donation._id),
        ).lean()
        res.status(201).json((await attachItems([createdDonation]))[0])
    } catch (error) {
        next(error)
    }
}

const deleteDonation = async (req, res, next) => {
    const session = await mongoose.startSession()

    try {
        let deletedDonation

        // Keep the history check and both deletions atomic to avoid orphaned item records.
        await session.withTransaction(async () => {
            const donation = await Donation.findById(req.params.id).session(session)
            if (!donation) {
                return
            }

            const hasTransactions = await Transaction.exists({
                donation_id: donation._id,
            }).session(session)

            // Preserve a donation if it has activity recorded in the transactions collection.
            if (hasTransactions) {
                const error = new Error(
                    'This donation has transaction history and cannot be deleted',
                )
                error.statusCode = 409
                throw error
            }

            await DonationItem.deleteMany({ donation_id: donation._id }, { session })
            deletedDonation = await Donation.findByIdAndDelete(donation._id, { session })
        })

        if (!deletedDonation) {
            return res.status(404).json({ error: 'No such donation' })
        }

        res.status(200).json(deletedDonation)
    } catch (error) {
        next(error)
    } finally {
        await session.endSession()
    }
}

const updateDonation = async (req, res, next) => {
    try {
        // Permit updates only to fields that belong to the donation document.
        const updates = Object.fromEntries(
            Object.entries(req.body).filter(([field]) => donationFields.includes(field)),
        )

        if (typeof updates.calamity_id === 'string' && !updates.calamity_id.trim()) {
            updates.calamity_id = null
        }

        if (updates.donor_id) {
            // Validate a replacement donor only when the request includes one.
            updates.donor_id = updates.donor_id.trim()
            const donor = await User.findOne({
                _id: updates.donor_id,
                role: 'Donor',
                account_status: 'Active',
            })
            if (!donor) {
                return res.status(400).json({ error: 'An active donor user is required' })
            }
        }

        if (updates.calamity_id) {
            // Reject references to calamities that are not in the database.
            const calamity = await Calamity.exists({ _id: updates.calamity_id })
            if (!calamity) {
                return res.status(400).json({ error: 'The selected calamity does not exist' })
            }
        }

        const donation = await Donation.findByIdAndUpdate(
            req.params.id,
            updates,
            // Return the updated record and apply the schema's field validators.
            { new: true, runValidators: true },
        )

        if (!donation) {
            return res.status(404).json({ error: 'No such donation' })
        }

        res.status(200).json(
            (await attachItems([
                await populateDonation(Donation.findById(donation._id)).lean(),
            ]))[0],
        )
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getDonation,
    getDonations,
    createDonation,
    deleteDonation,
    updateDonation,
}