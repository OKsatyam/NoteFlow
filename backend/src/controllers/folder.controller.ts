import { Request, Response, NextFunction } from "express";
import {
    createFolderService,
    listFoldersService,
    renameFolderService,
    deleteFolderService,
} from "../services/folder.service";
import { AppError } from "../utils/AppError";

export const createFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, name } = req.body;

        if (!username) throw new AppError("Username is required", 400);
        if (!name) throw new AppError("Folder name is required", 400);

        const folder = await createFolderService(username, name);

        res.status(201).json({
            success: true,
            message: "Folder created successfully",
            data: folder,
        });
    } catch (error) {
        next(error);
    }
};

export const listFolders = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username } = req.body;

        if (!username) throw new AppError("Username is required", 400);

        const folders = await listFoldersService(username);

        res.status(200).json({
            success: true,
            data: folders,
        });
    } catch (error) {
        next(error);
    }
};

export const renameFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { folderId } = req.params;
        const { username, name } = req.body;

        if (!username) throw new AppError("Username is required", 400);
        if (!folderId || typeof folderId !== "string") throw new AppError("Invalid folderId", 400);
        if (!name) throw new AppError("Folder name is required", 400);

        const folder = await renameFolderService(folderId, username, name);

        res.status(200).json({
            success: true,
            message: "Folder renamed successfully",
            data: folder,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteFolder = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { folderId } = req.params;
        const { username } = req.body;

        if (!username) throw new AppError("Username is required", 400);
        if (!folderId || typeof folderId !== "string") throw new AppError("Invalid folderId", 400);

        const result = await deleteFolderService(folderId, username);

        res.status(200).json({
            success: true,
            message: `Folder deleted and ${result.pagesMovedToTrash} page(s) moved to trash`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};