import Application from "../models/Application.js";
import Job from "../models/Job.js";
import { AppError } from "../utils/AppError.js";
import { catchAndWrap } from "../utils/catchAndWrap.js";
import {
  postJobSchema,
  getAllMyApplicationsSchema,
  getJobStatusSchema,
  getAllApplicationsSchema,
  updateJobStatusSchema,
  updateApplicationStatusSchema,
  getJobPostsSchema,
  deleteJobSchema,
  deleteApplicationSchema,
} from "../zodSchema/job.validation.js";
import Company from "../models/Company.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { jobOptions } from "../utils/queryOperations/jobOptions.js";

export const applyToJob = async (req, res) => {
  const userId = req.user._id;
  const { jobId } = req.params;

  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  const job = await catchAndWrap(
    () => Job.findById(jobId),
    "Job not found",
    404
  );
  if (!job) throw new AppError("Job does not exist", 404);

  const existing = await catchAndWrap(
    () => Application.findOne({ job: jobId, user: userId }),
    "Failed to check existing application"
  );
  if (existing) throw new AppError("You already applied to this job", 400);

  const application = await catchAndWrap(
    () =>
      Application.create({
        job: jobId,
        user: userId,
        resume: parsed.data.resume,
        coverLetter: parsed.data.coverLetter,
      }),
    "Failed to submit application"
  );

  res.status(201).json({ success: true, data: application });
};

export const postJob = async (req, res) => {
  //   console.log(req.user);
  const user = req.user;

  const parsed = postJobSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  const jobData = parsed.data;

  if (!user.company) {
    throw new AppError("You must be part of a company to post jobs", 403);
  }
  console.log("user.company", user.company);

  const company = await catchAndWrap(
    () => Company.findById(user.company),
    "Failed to find company"
  );
  if (!company) throw new AppError("Company not found", 404);

  const job = new Job({
    ...jobData,
    company: company._id,
    companyName: company.name,
    postedBy: user._id,
  });

  await catchAndWrap(() => job.save(), "Failed to post job");

  res.status(201).json({
    success: true,
    message: "Job posted successfully",
    job,
  });
};

export const getAApplication = async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;

  const application = await catchAndWrap(
    () => Application.findOne({ job: jobId, user: userId }).populate("job"),
    "Failed to fetch your application for this job"
  );

  if (!application) throw new AppError("Application not found", 404);

  res.status(200).json({
    success: true,
    data: application,
  });
};

export const getAllMyApplications = async (req, res) => {
  const parsed = getAllMyApplicationsSchema.safeParse(req);
  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  const userId = req.user._id;
  const { status } = parsed.data.query;

  const filter = { user: userId };
  if (status) filter.status = status;

  const applications = await catchAndWrap(
    () => Application.find(filter).populate("job"),
    "Failed to fetch applications"
  );

  res.status(200).json({
    success: true,
    data: applications,
  });
};

export const getJobStatus = async (req, res) => {
  const parsed = getJobStatusSchema.safeParse(req);
  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  const userId = req.user._id;
  const { jobId } = parsed.data.params;

  const application = await catchAndWrap(
    () =>
      Application.findOne({ job: jobId, user: userId }).populate({
        path: "job",
        select: "title companyName",
      }),
    "Failed to fetch application status"
  );

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      status: application.status,
      appliedAt: application.createdAt,
      jobTitle: application.job?.title,
      companyName: application.job?.companyName,
    },
  });
};

export const getAllApplicationForAJob = async (req, res) => {
  const parsed = getAllApplicationsSchema.safeParse(req);
  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  const { jobId } = parsed.data.params;
  const userCompanyId = req.user.company;

  const job = await catchAndWrap(
    () => Job.findById(jobId),
    "Failed to fetch job"
  );

  if (!job) throw new AppError("Job not found", 404);
  if (String(job.company) !== String(userCompanyId)) {
    throw new AppError("Unauthorized to view applications for this job", 403);
  }

  const applications = await catchAndWrap(
    () =>
      Application.find({ job: jobId }).populate({
        path: "user",
        select: "name email resume",
      }),
    "Failed to fetch applications"
  );

  res.status(200).json({
    success: true,
    data: applications,
  });
};

export const updateJobStatus = async (req, res) => {
  const parsed = updateJobStatusSchema.safeParse({
    params: req.params,
    body: req.body,
  });
  console.log("Validation error details:", parsed.error);
  console.log(req.params, req.body);

  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  const { companyId, jobId } = parsed.data.params;
  const { status } = parsed.data.body;

  const job = await catchAndWrap(
    () => Job.findOne({ _id: jobId, company: companyId }),
    "Failed to find job post",
    404
  );

  if (!job) {
    throw new AppError("Job not found", 404);
  }
  // console.log("status:", status);
  job.status = status;

  const updated = await catchAndWrap(
    () => job.save(),
    "Failed to update job status"
  );

  res.status(200).json({
    success: true,
    message: "Job application status updated successfully",
    data: updated,
  });
};

export const updateApplicationStatus = async (req, res) => {
  console.log(req.params, ",", req.body);
  const parsed = updateApplicationStatusSchema.safeParse({
    params: req.params,
    body: req.body,
  });

  if (!parsed.success) {
    throw new AppError(
      "Validation failed for schema",
      400,
      parsed.error.issues
    );
  }

  const { companyId, applicationId } = parsed.data.params;
  const { status } = parsed.data.body;

  const application = await catchAndWrap(
    () =>
      Application.findOne({ _id: applicationId }).populate({
        path: "job",
        select: "company",
      }),
    "Failed to fetch application",
    404
  );

  if (!application || application.job.company.toString() !== companyId) {
    throw new AppError("Application not found under this company", 404);
  }

  application.status = status;

  await catchAndWrap(() => application.save(), "Failed to update status");

  res.status(200).json({
    success: true,
    message: "Application status updated",
  });
};

export const getJobPosts = async (req, res) => {
  const parsed = getJobPostsSchema.safeParse({ params: req.params, query: req.query });
  if (!parsed.success) {
    throw new AppError("Validation failed", 400, parsed.error.errors);
  }

  const { jobId } = parsed.data.params;
  const query = parsed.data.query;

  if (jobId) {
    const job = await catchAndWrap(
      () => Job.findById(jobId).populate("company", "name industry"),
      "Job not found",
      404
    );

    return res.status(200).json({
      success: true,
      message: "Job post fetched successfully",
      data: job,
    });
  }

  const filter = jobOptions(query);
  const jobs = await Job.find(filter).populate("company", "name industry");

  res.status(200).json({
    success: true,
    message: "Filtered job posts fetched successfully",
    data: jobs,
  });
};

export const deleteJobPost = async (req, res) => {
  const parsed = deleteJobSchema.safeParse({ params: req.params });
  if (!parsed.success)
    throw new AppError("Validation failed", 400, parsed.error.errors);

  const { companyId, jobId } = parsed.data.params;

  const deleted = await catchAndWrap(
    () => Job.findOneAndDelete({ _id: jobId, company: companyId }),
    "Failed to delete job post",
    404
  );

  if (!deleted) throw new AppError("Job not found", 404);

  res.status(200).json({
    success: true,
    message: "Job post deleted successfully",
  });
};

export const deleteApplication = async (req, res) => {
  const parsed = deleteApplicationSchema.safeParse({ params: req.params });
  if (!parsed.success)
    throw new AppError("Validation failed", 400, parsed.error.errors);

  const { jobId, applicationId } = parsed.data.params;
  // console.log(jobId, applicationId);

  const deleted = await catchAndWrap(
    () =>
      Application.findOneAndDelete({ _id: applicationId, job: jobId }),
    "Failed to delete application",
    404
  );

  if (!deleted) throw new AppError("Application not found", 404);

  res.status(200).json({
    success: true,
    message: "Job application deleted successfully",
  });
};
