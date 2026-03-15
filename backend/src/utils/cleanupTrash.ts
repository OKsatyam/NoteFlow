import Page from "../models/page.model";
import Folder from "../models/folder.model";

export const cleanupTrash = async () => {
    try {
        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        // permanently delete pages in trash older than 15 days
        const deletedPages = await Page.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: fifteenDaysAgo },
        });

        // permanently delete folders in trash older than 15 days
        const deletedFolders = await Folder.deleteMany({
            isDeleted: true,
            deletedAt: { $lte: fifteenDaysAgo },
        });

        console.log(
            `[Cleanup] ${deletedPages.deletedCount} pages and ${deletedFolders.deletedCount} folders permanently deleted`
        );
    } catch (error) {
        console.error("[Cleanup] Error during trash cleanup:", error);
    }
};