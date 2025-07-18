import multer from "multer";
import { avatarStorage, resumeStorage } from "../config/cloudinary.js";

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadResume = multer({ storage: resumeStorage });
