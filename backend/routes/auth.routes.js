import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logOut,
  updateUserRole,
  forgotPassword,
  resetPassword,
  enable2FA,
  verify2FA,
  disable2FA,
  verifySignup2FA,
  updateMe,
} from "../controllers/auth.controller.js";
import { authentication } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authentication, getMe);
router.patch("/me", authentication, updateMe);
router.post("/logout", logOut);
router.patch("/update-role", updateUserRole);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token/:id", resetPassword);
router.post("/enable-2fa", authentication, enable2FA);
router.post("/verify-2fa", authentication, verify2FA);
router.post("/disable-2fa", authentication, disable2FA);
router.post("/verify-signup-2fa", verifySignup2FA);

export default router;
