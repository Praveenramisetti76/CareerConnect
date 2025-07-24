import express from "express";
import { authentication } from "../middleware/auth.js";
import { role } from "../middleware/role.js";
import {
  getCandidateDashboardStats,
  getRecentApplications,
  getRecommendedJobs,
  getCandidateMetrics,
} from "../controllers/candidateDashboard.controller.js";

const router = express.Router();

// All candidate dashboard routes require authentication and candidate role
router.use(authentication);
router.use(role("candidate"));

// Candidate dashboard statistics
router.get("/stats", getCandidateDashboardStats);

// Recent applications
router.get("/recent-applications", getRecentApplications);

// Recommended jobs
router.get("/recommended-jobs", getRecommendedJobs);

// Candidate metrics
router.get("/metrics", getCandidateMetrics);

export default router;
