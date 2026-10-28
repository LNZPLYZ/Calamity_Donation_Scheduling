
import User from "../models/UserModel.js";

// CREATE: Add a new user
export const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// READ: Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({
            enrolledDate: -1
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

// READ: Get one user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                error: "User profile not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// UPDATE: Update a user by ID
export const updateUser = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                error: "User profile not found"
            });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};

// DELETE: Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(
            req.params.id
        );

        if (!deletedUser) {
            return res.status(404).json({
                error: "User profile not found"
            });
        }

        res.status(200).json({
            message: "User profile deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
};
