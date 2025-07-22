import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logOut,
  updateUserRole,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { authentication } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authentication, getMe);
router.post("/logout", logOut);
router.patch("/update-role", updateUserRole);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token/:id", resetPassword);

export default router;
