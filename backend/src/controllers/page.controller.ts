import { Request, Response } from "express";
import Page from "../models/page.model";
import User from "../models/user.model";
import slugify from "slugify";

export const createPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, title } = req.body;

    if (!username) {
      res.status(400).json({
        success: false,
        message: "Username is required",
      });
      return;
    }

    const user = await User.findOne({ username });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const pageTitle = title || "Untitled";

    const slug = slugify(pageTitle, {
      lower: true,
      strict: true,
    });

    const page = await Page.create({
      title: pageTitle,
      slug,
      userId: user._id,
      content: {},
    });

    res.status(201).json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("create page error", error);
    res.status(500).json({
      success: false,
      message: "Failed to create page",
      error: error instanceof Error ? error.message : String(error)
    });
  }
};