import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    username: string;
    email: string;
    image?: string;
    password?: string;
    provider: "google" | "github" | "credentials";
    isOnboarded: boolean;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        image: {
            type: String,
        },

        password: {
            type: String,
        },

        provider: {
            type: String,
            enum: ["google", "github", "credentials"],
            required: true,
        },

        isOnboarded: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;