import multer from "multer";

import {
  avatarStorage,
  resumeStorage,
  companyLogoStorage,
  companyCoverStorage,
} from "../config/cloudinary.js";

export const uploadAvatar = multer({ storage: avatarStorage });
export const uploadResume = multer({ storage: resumeStorage });
export const logoUpload = multer({ storage: companyLogoStorage });
export const coverUpload = multer({ storage: companyCoverStorage });
