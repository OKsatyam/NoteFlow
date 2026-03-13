import { Request, Response, NextFunction } from "express";
import { createPageService, updatePageService } from "../services/page.service";
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