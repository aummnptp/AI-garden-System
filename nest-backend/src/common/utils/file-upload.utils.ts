import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";
import { extname } from "path";


export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png"];

export const fileFilter = (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return cb(new BadRequestException("Only JPG and PNG images are allowed"), false);
  }
  cb(null, true);
};

export const storage = (destination: string) =>
  diskStorage({
    destination,
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    },
  });
