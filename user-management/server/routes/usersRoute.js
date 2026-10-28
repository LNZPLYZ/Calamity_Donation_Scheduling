
import express from "express";

import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "../controller/UserController.js";

const router = express.Router();

// CREATE a new user
router.post("/", createUser);

// READ all users
router.get("/", getUsers);

// READ one user by ID
router.get("/:id", getUserById);

// UPDATE a user by ID
router.put("/:id", updateUser);

// DELETE a user by ID
router.delete("/:id", deleteUser);

export default router;
