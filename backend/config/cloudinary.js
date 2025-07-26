import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "avatars",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 512, height: 512, crop: "limit" }],
    };
  },
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "resumes",
      resource_type: "auto",
      type: "upload",
      allowed_formats: ["pdf", "doc", "docx"],
    };
  },
});

const companyLogoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "company_logos",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 512, height: 512, crop: "limit" }],
    };
  },
});

const companyCoverStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "company_covers",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 1600, height: 400, crop: "limit" }],
    };
  },
});

export {
  avatarStorage,
  resumeStorage,
  cloudinary,
  companyLogoStorage,
  companyCoverStorage,
};
