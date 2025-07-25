import express from "express";
import { authentication } from "../middleware/auth.js";
import { role } from "../middleware/role.js";
import {
  getDashboardStats,
  getTopJobs,
  getCompanyMetrics,
  submitContactForm,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

// All dashboard routes require authentication and recruiter role
router.use(authentication);
router.use(role("recruiter"));

// Dashboard statistics
router.get("/stats", getDashboardStats);

// Top performing jobs
router.get("/top-jobs", getTopJobs);

// Company metrics
router.get("/company-metrics", getCompanyMetrics);

router.post("/contact", submitContactForm);

export default router;
