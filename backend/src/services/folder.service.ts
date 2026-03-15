import Folder from "../models/folder.model";
import Page from "../models/page.model";
import User from "../models/user.model";
import { AppError } from "../utils/AppError";

// Create folder
export const createFolderService = async (username: string, name: string) => {
    if (!username) throw new AppError("Username is required", 400);
    if (!name) throw new AppError("Folder name is required", 400);

    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    // check if folder with same name already exists for this user
    const existingFolder = await Folder.findOne({
        userId: user._id,
        name: name.trim(),
        isDeleted: false,
    });

    if (existingFolder) {
        throw new AppError("Folder with this name already exists", 409);
    }

    const folder = await Folder.create({
        name: name.trim(),
        userId: user._id,
    });

    return folder;
};

// List folders
export const listFoldersService = async (username: string) => {
    if (!username) throw new AppError("Username is required", 400);

    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    const folders = await Folder.find({
        userId: user._id,
        isDeleted: false,
    }).sort({ createdAt: -1 });

    return folders;
};

// Rename folder
export const renameFolderService = async (
    folderId: string,
    username: string,
    name: string
) => {
    if (!name) throw new AppError("Folder name is required", 400);

    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    const folder = await Folder.findOne({ _id: folderId, isDeleted: false });
    if (!folder) throw new AppError("Folder not found", 404);

    // ownership check
    if (folder.userId.toString() !== user._id.toString()) {
        throw new AppError("You do not have access to this folder", 403);
    }

    // check if another folder with same name exists
    const existingFolder = await Folder.findOne({
        userId: user._id,
        name: name.trim(),
        isDeleted: false,
        _id: { $ne: folderId }, // exclude current folder
    });

    if (existingFolder) {
        throw new AppError("Folder with this name already exists", 409);
    }

    folder.name = name.trim();
    await folder.save();

    return folder;
};

// Delete folder + move pages to trash
export const deleteFolderService = async (
    folderId: string,
    username: string
) => {
    const user = await User.findOne({ username });
    if (!user) throw new AppError("User not found", 404);

    const folder = await Folder.findOne({ _id: folderId, isDeleted: false });
    if (!folder) throw new AppError("Folder not found", 404);

    // ownership check
    if (folder.userId.toString() !== user._id.toString()) {
        throw new AppError("You do not have access to this folder", 403);
    }

    // soft delete all pages inside this folder
    const trashedPages = await Page.updateMany(
        { folderId, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() }
    );

    // soft delete the folder
    folder.isDeleted = true;
    folder.deletedAt = new Date();
    await folder.save();

    return {
        folder,
        pagesMovedToTrash: trashedPages.modifiedCount,
    };
};