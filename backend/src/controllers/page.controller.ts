import { Request, Response, NextFunction } from "express";
import {
  createPageService, updatePageService, getPageByIdService,
  listPagesService, deletePageService, getTrashedPagesService,
  restorePageService, hardDeletePageService, publishPageService,
  unpublishPageService, getPublicPageService
}
  from "../services/page.service";
import { AppError } from "../utils/AppError";

export const createPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = await createPageService(req.body);

    res.status(201).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageId } = req.params;

    // validate pageId
    if (!pageId || typeof pageId !== "string") {
      throw new AppError("Invalid pageId", 400);
    }

    const updatedPage = await updatePageService(pageId, req.body);

    res.status(200).json({
      success: true,
      data: updatedPage,
    });
  } catch (error) {
    next(error);
  }
};

export const getPageById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { username } = req.body;

    if (!username) {
      throw new AppError("Username is required", 400);
    }

    if (!pageId || typeof pageId !== "string") {
      throw new AppError("Invalid pageId", 400);
    }

    const page = await getPageByIdService(pageId, username);

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

export const listPages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.body;

    if (!username) {
      throw new AppError("Username is required", 400);
    }

    const data = await listPagesService(username);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};


export const deletePage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { username } = req.body;

    if (!username) throw new AppError("Username is required", 400);

    if (!pageId || typeof pageId !== "string") {
      throw new AppError("Invalid pageId", 400);
    }
    const page = await deletePageService(pageId, username);

    res.status(200).json({
      success: true,
      message: "Page moved to trash",
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrashedPages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.body;

    if (!username) throw new AppError("Username is required", 400);

    const pages = await getTrashedPagesService(username);

    res.status(200).json({
      success: true,
      data: pages,
    });
  } catch (error) {
    next(error);
  }
};

export const restorePage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { username } = req.body;

    if (!username) throw new AppError("Username is required", 400);
    if (!pageId || typeof pageId !== "string") {
      throw new AppError("Invalid pageId", 400);
    }

    const page = await restorePageService(pageId, username);

    res.status(200).json({
      success: true,
      message: "Page restored successfully",
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

export const hardDeletePage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { username } = req.body;

    if (!username) throw new AppError("Username is required", 400);
    if (!pageId || typeof pageId !== "string") {
      throw new AppError("Invalid pageId", 400);
    }

    const result = await hardDeletePageService(pageId, username);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const publishPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { username } = req.body;

    if (!username) throw new AppError("Username is required", 400);
    if (!pageId || typeof pageId !== "string") throw new AppError("Invalid pageId", 400);

    const page = await publishPageService(pageId, username);

    res.status(200).json({
      success: true,
      message: "Page published successfully",
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

export const unpublishPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pageId } = req.params;
    const { username } = req.body;

    if (!username) throw new AppError("Username is required", 400);
    if (!pageId || typeof pageId !== "string") throw new AppError("Invalid pageId", 400);

    const page = await unpublishPageService(pageId, username);

    res.status(200).json({
      success: true,
      message: "Page unpublished successfully",
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicPage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, slug } = req.params;

    if (!username || typeof username !== "string") throw new AppError("Username is required", 400);
    if (!slug || typeof slug !== "string") throw new AppError("Slug is required", 400);

    const page = await getPublicPageService(username, slug);

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};