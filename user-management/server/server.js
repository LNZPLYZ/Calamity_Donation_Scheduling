
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/usersRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Donation Pickup Scheduling API is running"
    });
});

// Mount user routes
app.use("/api/users", userRoutes);

// Connect to MongoDB Atlas
async function startServer() {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is missing from .env");
        }

        await mongoose.connect(process.env.MONGODB_URL);

        console.log("MongoDB Atlas connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup error:", error.message);
        process.exit(1);
    }
}

startServer();
