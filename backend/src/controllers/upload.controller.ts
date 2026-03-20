import { Request, Response, NextFunction } from 'express'
import cloudinary from '../config/cloudinary'
import { AppError } from '../utils/AppError'

export const uploadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400)
    }

    // Upload to Cloudinary from in-memory buffer
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'noteflow',
            resource_type: 'image',
            transformation: [
              { quality: 'auto', fetch_format: 'auto' },
              { width: 1920, height: 1080, crop: 'limit' },
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )
        .end(req.file!.buffer)
    })

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      },
    })
  } catch (error) {
    next(error)
  }
}
