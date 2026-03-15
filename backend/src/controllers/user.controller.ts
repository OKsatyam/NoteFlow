import { Request, Response, NextFunction } from "express";
import {
    checkUsernameService,
    createUserService,
    getUserByUsernameService,
} from "../services/user.service";

export const checkUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username } = req.body;
        if (!username) {
            res.status(400).json({ success: false, message: "Username is required" });
            return;
        }

        const result = await checkUsernameService(username);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await createUserService(req.body);
        
        // Remove password from the response object
        const userObj = user.toObject();
        if (userObj.password) {
            delete userObj.password;
        }
        
        res.status(201).json({ success: true, data: userObj });
    } catch (error) {
        next(error);
    }
};

export const getUserByUsername = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const username = req.params.username as string;
        if (!username) {
            res.status(400).json({ success: false, message: "Username is required" });
            return;
        }
        
        const user = await getUserByUsernameService(username);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};
