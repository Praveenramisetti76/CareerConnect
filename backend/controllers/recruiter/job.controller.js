// controllers/recruiter/job.controller.js
import Job from "../../models/job.model.js";
import { AppError } from "../../utils/AppError.js";
import { catchAndWrap } from "../../utils/catchAndWrap.js";
import { jobSchema } from "../../validations/job.validation.js";

export const postJob = async (req, res) => {
  const validated = jobSchema.parse(req.body);

  const job = await catchAndWrap(
    async () => await Job.create({ ...validated, postedBy: req.user.id }),
    "Failed to post job"
  );

  res.status(201).json({ success: true, job });
};

export const deleteJob = async (req, res) => {
  const { jobId } = req.params;

  const job = await catchAndWrap(
    async () => await Job.findById(jobId),
    "Job not found",
    404
  );

  if (!job) throw new AppError("Job not found", 404);
  if (job.postedBy.toString() !== req.user.id)
    throw new AppError("Unauthorized", 403);

  await catchAndWrap(() => job.deleteOne(), "Failed to delete job");

  res.status(200).json({ success: true, message: "Job deleted" });
};

export const editJob = async (req, res) => {
  const { jobId } = req.params;
  const validated = jobSchema.partial().parse(req.body);

  const job = await catchAndWrap(
    async () => await Job.findById(jobId),
    "Job not found",
    404
  );

  if (!job) throw new AppError("Job not found", 404);
  if (job.postedBy.toString() !== req.user.id)
    throw new AppError("Unauthorized", 403);

  Object.assign(job, validated);
  await catchAndWrap(() => job.save(), "Failed to update job");

  res.status(200).json({ success: true, job });
};

export const viewJob = async (req, res) => {
  const jobs = await catchAndWrap(
    () => Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 }),
    "Failed to fetch jobs"
  );

  res.status(200).json({ success: true, jobs });
};


export { postJob, deleteJob, editJob, viewJob };
