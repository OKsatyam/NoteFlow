import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db";
import User from "../models/user.model";

dotenv.config();

const createUser = async () => {
    try {
        await connectDB();

        const user = await User.create({
            name: "Test User",
            username: "testuser",
            email: "test@example.com",
        });

        console.log("User created:");
        console.log(user);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createUser();