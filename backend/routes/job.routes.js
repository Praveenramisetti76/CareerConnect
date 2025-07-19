import { Router } from "express";
import {
  postJob,
  applyToJob,
  getAllMyApplications,
  getAApplication,
  getAllApplicationForAJob,
  updateJobStatus,
  deleteApplication,
  getJobStatus,
  getJobPosts,
  updateApplicationStatus,
  deleteJobPost
} from "../controllers/job.controller.js";

import { authentication } from "../middleware/auth.js";
import { role } from "../middleware/role.js";
import { checkCompanyRole } from "../middleware/companyRole.js";

const router = Router();
router.use(authentication);

router.post("/post", role("recruiter"), checkCompanyRole("recruiter"), postJob); //

router.get(
  "/:companyId/applications/:jobId",
  role("recruiter"),
  checkCompanyRole("recruiter", "admin"),
  getAllApplicationForAJob
); //
router.put(
  "/:companyId/:jobId/status",
  role("recruiter"),
  checkCompanyRole("recruiter", "admin"),
  updateJobStatus
); //
router.delete(
  "/:jobId/application/delete/:applicationId",
  deleteApplication
);//
router.put(
  "/:companyId/applications/:applicationId/status",
  role("recruiter"),
  checkCompanyRole("recruiter", "admin"),
  updateApplicationStatus
); //
router.delete("/:companyId/delete/:jobId/", deleteJobPost);//

router.get("/posts", getJobPosts); //
router.get("/status/:jobId", getJobStatus); //
router.post("/apply/:jobId", applyToJob); //

router.get("/my/applications", getAllMyApplications); //
router.get("/my/applications/:jobId", getAApplication); //

export default router;
