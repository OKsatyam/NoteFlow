import express from "express";
import { createPage } from "../../controllers/page.controller";

const router = express.Router();

router.post("/", createPage);

export default router;