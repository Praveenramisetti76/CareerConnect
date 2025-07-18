import { Router } from "express";
import { authentication } from "../../middleware/auth.js";
import {
  getProfile,
  updateProfile, // You probably meant `updateProfile`
  updateProfileAvatar, // same here
  deleteAvatar,
  deleteProfile,
} from "../../controllers/user/profile.controller.js";

const router = Router();
router.use(authentication);

router.get("/view", getProfile);
router.put("/update", updateProfile);
router.patch("/update-avatar", updateProfileAvatar);
router.patch("/update-resume", (req, res) => {
  res.status(501).json({ message: "Resume update route not implemented yet." });
});
router.delete("/delete-avatar", deleteAvatar);
router.delete("/delete", deleteProfile);
router.delete("/delete-resume", (req, res) => {
  res.status(501).json({ message: "Resume delete route not implemented yet." });
});

export default router;
