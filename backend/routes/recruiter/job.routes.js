import { Router } from "express";
import {
  postJob,
  deleteJob,
  editJob,
  viewJob,
} from "../../controllers/recruiter/job.controller";

const router = Router();

router.post("/post", postJob);
router.put("/:job-id/edit", editJob);
router.delete("/job-id/delete", deleteJob);
router.get("/view", viewJob);

export default router;
