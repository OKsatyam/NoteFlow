import express from "express";
import { getPublicPage } from "../../controllers/page.controller";

const router = express.Router();

// Public route to get a published page
router.get("/:username/:slug", getPublicPage);

export default router;