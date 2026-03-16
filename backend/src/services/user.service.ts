import bcrypt from "bcrypt";
import User, { IUser } from "../models/user.model";
import { AppError } from "../utils/AppError";

interface CreateUserData {
    name: string;
    username: string;
    email: string;
    image?: string;
    provider: "google" | "github" | "credentials";
    password?: string;
}

export const checkUsernameService = async (username: string) => {
    if (!username) throw new AppError("Username is required", 400);

    // only allow lowercase letters, numbers, hyphens
    const isValid = /^[a-z0-9-]+$/.test(username);
    if (!isValid) throw new AppError("Username can only contain lowercase letters, numbers and hyphens", 400);

    const user = await User.findOne({ username });
    return { available: !user };
};

export const createUserService = async (data: CreateUserData) => {
    if (!data.username) throw new AppError("Username is required", 400);
    if (!data.email) throw new AppError("Email is required", 400);

    // validate username format
    const isValid = /^[a-z0-9-]+$/.test(data.username);
    if (!isValid) throw new AppError("Username can only contain lowercase letters, numbers and hyphens", 400);

    // If email already exists, return existing user (upsert pattern)
    let user = await User.findOne({ email: data.email });

    if (user) {
        return user;
    }

    const payload: Partial<IUser> = { ...data };

    if (data.provider === "credentials") {
        if (!data.password) {
            throw new AppError("Password is required for credentials provider", 400);
        }
        const salt = await bcrypt.genSalt(10);
        payload.password = await bcrypt.hash(data.password, salt);
    }

    user = await User.create(payload);
    return user;
};

export const getUserByUsernameService = async (username: string) => {
    // Exclude password from the response
    const user = await User.findOne({ username }).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
};

export const loginUserService = async (email: string, password?: string) => {
    if (!email) throw new AppError("Email is required", 400);
    if (!password) throw new AppError("Password is required", 400);

    // We explicitly selecting the password since it is not automatically returned
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError("Invalid credentials", 401);
    }

    if (user.provider !== "credentials") {
        throw new AppError(`User signed up with ${user.provider}. Please use that to login.`, 401);
    }

    if (!user.password) {
        throw new AppError("Invalid credentials", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new AppError("Invalid credentials", 401);
    }

    return user;
};
