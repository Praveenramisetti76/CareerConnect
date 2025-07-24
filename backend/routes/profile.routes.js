import express, { Router } from "express";
import { authentication } from "../middleware/auth.js";
import {
  getProfile,
  getUserById,
  updateProfile,
  updateProfileAvatar,
  deleteAvatar,
  deleteProfile,
  updateResume,
  deleteResume,
} from "../controllers/profile.controller.js";
import { uploadAvatar, uploadResume } from "../middleware/multer.js";

const router = Router();
router.use(authentication);
router.patch(
  "/update/avatar",
  uploadAvatar.single("avatar"),
  updateProfileAvatar
);
router.patch("/update/resume", uploadResume.single("resume"), updateResume);

router.get("/view", express.json(), getProfile);
router.get("/user/:userId", express.json(), getUserById);
router.put("/update", express.json(), updateProfile);
router.delete("/delete/avatar", express.json(), deleteAvatar);
router.delete("/delete", express.json(), deleteProfile);
router.delete("/delete/resume", express.json(), deleteResume);

export default router;
