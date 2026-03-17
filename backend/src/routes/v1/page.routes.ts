import express from "express";
import {
    createPage,
    updatePage,
    getPageById,
    listPages,
    deletePage,
    getTrashedPages,
    restorePage,
    hardDeletePage,
    publishPage,
    unpublishPage,
} from "../../controllers/page.controller";

const router = express.Router();

// Create page
router.post("/", createPage);

// List all pages (folders + loose)
router.get("/", listPages);

// Trash — must be BEFORE /:pageId to avoid being swallowed by the param route
router.get("/trash", getTrashedPages);
router.patch("/trash/:pageId/restore", restorePage);
router.delete("/trash/:pageId", hardDeletePage);

// Single page CRUD
router.get("/:pageId", getPageById);
router.patch("/:pageId", updatePage);
router.delete("/:pageId", deletePage);

// Publish / unpublish
router.patch("/:pageId/publish", publishPage);
router.patch("/:pageId/unpublish", unpublishPage);

export default router;