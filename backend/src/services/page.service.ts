import Page from "../models/page.model";
import User from "../models/user.model";
import slugify from "slugify";
import { AppError } from "../utils/AppError";
import Folder from "../models/folder.model";

export const createPageService = async ({
  username,
  title,
  folderId,
}: {
  username: string;
  title?: string;
  folderId?: string;
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

  let finalSlug = slug;
  let counter = 1;
  while (
    await Page.findOne({
      userId: user._id,
      slug: finalSlug,
      isDeleted: false,
    })
  ) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  const page = await Page.create({
    title: pageTitle,
    slug: finalSlug,
    userId: user._id,
    content: {},
    folderId: folderId || null,
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


export const getPageByIdService = async (
  pageId: string,
  username: string
) => {
  // Step 1 — find user
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Step 2 — find page that is not soft deleted
  const page = await Page.findOne({ _id: pageId, isDeleted: false })
    .populate("folderId", "name"); // only return folder name, nothing else

  if (!page) {
    throw new AppError("Page not found", 404);
  }

  // Step 3 — check ownership
  if (page.userId.toString() !== user._id.toString()) {
    throw new AppError("You do not have access to this page", 403);
  }

  return page;
};

export const listPagesService = async (username: string) => {
  // Step 1 — find user
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Step 2 — get all pages excluding trash, excluding content field
  const pages = await Page.find(
    { userId: user._id, isDeleted: false },
    { content: 0 } // 👈 exclude content — keeps response lightweight
  ).sort({ updatedAt: -1 }); // 👈 most recently updated first

  // Step 3 — get all folders for this user
  const folders = await Folder.find({
    userId: user._id,
    isDeleted: false,
  });

  // Step 4 — group pages under their folders
  const folderMap = folders.map((folder) => ({
    folder: {
      _id: folder._id,
      name: folder.name,
    },
    pages: pages.filter(
      (page) => page.folderId?.toString() === folder._id.toString()
    ),
  }));

  // Step 5 — loose pages (not inside any folder)
  const loosePagesData = pages.filter((page) => !page.folderId);

  return {
    folders: folderMap,
    loose: loosePagesData,
  };
};


// Move page to trash
export const deletePageService = async (pageId: string, username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const page = await Page.findOne({ _id: pageId, isDeleted: false });

  if (!page) {
    throw new AppError("Page not found", 404);
  }

  // ownership check
  if (page.userId.toString() !== user._id.toString()) {
    throw new AppError("You do not have access to this page", 403);
  }

  page.isDeleted = true;
  page.deletedAt = new Date();

  await page.save();

  return page;
};

// List all trashed pages
export const getTrashedPagesService = async (username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const pages = await Page.find(
    { userId: user._id, isDeleted: true },
    { content: 0 } // exclude heavy content
  ).sort({ deletedAt: -1 }); // most recently deleted first

  return pages;
};

// Restore page from trash
export const restorePageService = async (pageId: string, username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // find only deleted pages
  const page = await Page.findOne({ _id: pageId, isDeleted: true });

  if (!page) {
    throw new AppError("Page not found in trash", 404);
  }

  // ownership check
  if (page.userId.toString() !== user._id.toString()) {
    throw new AppError("You do not have access to this page", 403);
  }

  // Check if original folder still exists and is not deleted
  if (page.folderId) {
    const folder = await Folder.findOne({ _id: page.folderId, isDeleted: false });
    if (!folder) {
      // Folder was deleted → restore as loose page
      page.folderId = null;
    }
    // Folder exists → keep folderId intact → restores into original folder
  }

  page.isDeleted = false;
  page.deletedAt = null;

  await page.save();

  return page;
};

// Permanently delete page
export const hardDeletePageService = async (pageId: string, username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // can only hard delete pages already in trash
  const page = await Page.findOne({ _id: pageId, isDeleted: true });

  if (!page) {
    throw new AppError("Page not found in trash", 404);
  }

  // ownership check
  if (page.userId.toString() !== user._id.toString()) {
    throw new AppError("You do not have access to this page", 403);
  }

  await Page.deleteOne({ _id: pageId });

  return { message: "Page permanently deleted" };
};

// Publish page
export const publishPageService = async (pageId: string, username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const page = await Page.findOne({ _id: pageId, isDeleted: false });

  if (!page) {
    throw new AppError("Page not found", 404);
  }

  // ownership check
  if (page.userId.toString() !== user._id.toString()) {
    throw new AppError("You do not have access to this page", 403);
  }

  // block publishing if content is empty
  const isEmpty =
    !page.content ||
    Object.keys(page.content).length === 0;

  if (isEmpty) {
    throw new AppError("Cannot publish an empty page", 400);
  }

  // block if already published
  if (page.status === "published") {
    throw new AppError("Page is already published", 409);
  }

  page.status = "published";
  await page.save();

  return page;
};

// Unpublish page
export const unpublishPageService = async (pageId: string, username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const page = await Page.findOne({ _id: pageId, isDeleted: false });

  if (!page) {
    throw new AppError("Page not found", 404);
  }

  // ownership check
  if (page.userId.toString() !== user._id.toString()) {
    throw new AppError("You do not have access to this page", 403);
  }

  // block if already draft
  if (page.status === "draft") {
    throw new AppError("Page is already unpublished", 409);
  }

  page.status = "draft";
  await page.save();

  return page;
};

// Public page rendering — no auth needed
export const getPublicPageService = async (
  username: string,
  slug: string
) => {
  // find user by username
  const user = await User.findOne({ username });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // find published page by userId + slug
  const page = await Page.findOne({
    userId: user._id,
    slug,
    status: "published",
    isDeleted: false,
  });

  if (!page) {
    throw new AppError("Page not found", 404);
  }

  return page;
};