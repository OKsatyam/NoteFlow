import express from "express";
import {
    checkUsername,
    createUser,
    getUserByUsername,
    loginUser,
} from "../../controllers/user.controller";

const router = express.Router();

// Check if username is available
router.post("/check-username", checkUsername);

// Create or upsert a user
router.post("/", createUser);

// Get user profile by username
router.get("/:username", getUserByUsername);

// Login (email/password)
router.post("/login", loginUser);

export default router;
