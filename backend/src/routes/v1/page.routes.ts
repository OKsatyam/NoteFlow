import express from "express";
import { createPage, updatePage } from "../../controllers/page.controller";

const router = express.Router();

// Create page
router.post("/", createPage);

// Update page (autosave)
router.put("/:pageId", updatePage);

export default router;