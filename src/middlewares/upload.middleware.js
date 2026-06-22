import path from "node:path";
import fs from "node:fs";
import multer from "multer";
import { StatusCodes } from "http-status-codes";

import { AppError } from "../utils/app-error.js";
import { generateRandomToken } from "../utils/crypto.js";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads", "products");

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);
const MAX_FILES_SIZES = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${generateRandomToken(16)}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype))
    return cb(
      new AppError("Only JPEG, PNG, WEBP and GIF images are allowed", StatusCodes.BAD_REQUEST)
    );
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: MAX_FILES_SIZES, file: 1 } });

export function uploadProductImage(req, res, next) {
  upload.single("image")(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const message =
        err.code === "LIMIT_FILE_SIZE" ? "Image must be smaller than 5MB" : err.message;
      return next(new AppError(message, StatusCodes.BAD_REQUEST));
    }
    return next(err);
  });
}

export { UPLOAD_DIR };
