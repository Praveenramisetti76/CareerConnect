import User from "../models/User.js";
import { catchAndWrap } from "../utils/catchAndWrap.js";
import { AppError } from "../utils/AppError.js";
import { cloudinary } from "../config/cloudinary.js";

const allowedFields = [
  "name",
  "headline",
  "about",
  "location",
  "skills",
  "social",
  "experience",
  "education",
  "isOpenToWork",
];

export const getProfile = async (req, res) => {
  if (!req.user?.id) throw new AppError("Invalid ID", 400);

  const user = await catchAndWrap(
    () => User.findById(req.user.id),
    "User not found",
    404
  );

  res.status(200).json(user);
};

export const updateProfileAvatar = async (req, res) => {
  if (!req.user.id) throw new AppError("Unauthorized access", 401);
  if (!req.file) throw new AppError("Avatar not found", 400);

  const user = await catchAndWrap(
    () => User.findById(req.user.id),
    "User not found",
    404
  );

  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId);
  }

  user.avatarUrl = req.file.path;
  user.avatarPublicId = req.file.filename;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Avatar uploaded successfully",
    avatarUrl: user.avatarUrl,
  });
};

export const updateProfile = async (req, res) => {
  if (!req.user?.id) throw new AppError("Unauthorized", 401);

  const updates = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await catchAndWrap(
    () => User.findByIdAndUpdate(req.user.id, updates, { new: true }),
    "Failed to update profile",
    400
  );

  res.status(200).json({
    success: true,
    message: "Profile updated",
    user,
  });
};

export const updateResume = async (req, res) => {
  if (!req.user?.id) throw new AppError("Unauthorized", 401);
  if (!req.file) throw new AppError("Resume not found", 400);

  const user = await catchAndWrap(
    () => User.findById(req.user.id),
    "User not found",
    404
  );

  if (user.resumePublicId) {
    await cloudinary.uploader.destroy(user.resumePublicId);
  }

  user.resumeUrl = req.file.path;
  user.resumePublicId = req.file.filename;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Resume uploaded",
    resumeUrl: user.resumeUrl,
  });
};

export const deleteResume = async (req, res) => {
  if (!req.user?.id) throw new AppError("Unauthorized", 401);

  const user = await catchAndWrap(
    () => User.findById(req.user.id),
    "User not found",
    404
  );

  if (user.resumePublicId) {
    await cloudinary.uploader.destroy(user.resumePublicId);
    user.resumeUrl = undefined;
    user.resumePublicId = undefined;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Resume deleted",
  });
};

export const deleteAvatar = async (req, res) => {
  if (!req.user?.id) throw new AppError("Unauthorized", 401);

  const user = await catchAndWrap(
    () => User.findById(req.user.id),
    "User not found",
    404
  );

  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId);
    user.avatarUrl = undefined;
    user.avatarPublicId = undefined;
    await user.save();
  }

  res.status(200).json({
    success: true,
    message: "Avatar deleted",
  });
};

export const deleteProfile = async (req, res) => {
  if (!req.user?.id) throw new AppError("Unauthorized", 401);

  const user = await catchAndWrap(
    () => User.findById(req.user.id),
    "User not found",
    404
  );

  if (user.avatarPublicId)
    await cloudinary.uploader.destroy(user.avatarPublicId);
  if (user.resumePublicId)
    await cloudinary.uploader.destroy(user.resumePublicId);

  await User.findByIdAndDelete(req.user.id);

  res.status(200).json({
    success: true,
    message: "Profile deleted permanently",
  });
};
