import express from 'express'
import multer from 'multer'
import { uploadImage } from '../../controllers/upload.controller'

const router = express.Router()

// Store file in memory buffer — no disk I/O required
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'))
    }
  },
})

router.post('/', upload.single('image'), uploadImage)

export default router
