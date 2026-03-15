import express from "express";
import {
    createFolder,
    listFolders,
    renameFolder,
    deleteFolder,
} from "../../controllers/folder.controller";

const router = express.Router();

router.post("/", createFolder);
router.get("/", listFolders);
router.put("/:folderId", renameFolder);
router.delete("/:folderId", deleteFolder);

export default router;