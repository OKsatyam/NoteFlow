import Page from "../models/page.model";
import User from "../models/user.model";
import slugify from "slugify";
import { AppError } from "../utils/AppError";

export const createPageService = async ({
  username,
  title,
}: {
  username: string;
  title?: string;
}) => {
  if (!username) {
    throw new AppError("Username is required", 400);
  }

  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const pageTitle = title || "Untitled";

  const slug = slugify(pageTitle, {
    lower: true,
    strict: true,
  });

  const existingPage = await Page.findOne({
    userId: user._id,
    slug,
  });

  if (existingPage) {
    throw new AppError("Page with this title already exists", 409);
  }

  const page = await Page.create({
    title: pageTitle,
    slug,
    userId: user._id,
    content: {},
  });

  return page;
};

export const updatePageService = async (
  pageId: string,
  body: {
    title?: string;
    content?: any;
    icon?: string;
    coverImage?: string;
  }
) => {
  // isDeleted: false ensures soft deleted pages are treated as 404
  const page = await Page.findOne({ _id: pageId, isDeleted: false });

  if (!page) {
    throw new AppError("Page not found", 404);
  }

  // Only update allowed fields explicitly — never trust raw body
  if (body.title !== undefined) page.title = body.title;
  if (body.content !== undefined) page.content = body.content;
  if (body.icon !== undefined) page.icon = body.icon;
  if (body.coverImage !== undefined) page.coverImage = body.coverImage;

  await page.save();

  return page;
};