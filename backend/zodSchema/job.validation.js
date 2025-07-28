import { z } from "zod";

const objectId = () =>
  z.string().regex(/^[a-f\d]{24}$/, "Invalid ObjectId format");
const postJobSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  requirements: z.array(z.string()).optional(),

  location: z.string(),
  type: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
    "remote",
  ]),

  industry: z.string().optional(),

  salaryRange: z
    .object({
      min: z.string().optional(),
      max: z.string().optional(),
    })
    .optional(),

  applicationInstructions: z.string().optional(),
  logoUrl: z.string().optional(),
  logoPublicId: z.string().optional(),
});

const applySchema = z.object({
  resume: z.string().url("Resume must be a valid URL"),
});

const statusUpdateSchema = z.object({
  status: z.enum(["reviewed", "interview", "hired", "rejected"]),
});

export const getAllMyApplicationsSchema = z.object({
  query: z.object({
    status: z
      .enum(["applied", "reviewed", "interview", "hired", "rejected"])
      .optional(),
  }),
});

const getAllApplicationsSchema = z.object({
  params: z.object({
    jobId: z.string().length(24, "Invalid job ID"),
  }),
});

const getJobStatusSchema = z.object({
  params: z.object({
    jobId: z.string().length(24, "Invalid job ID format"),
  }),
});

const updateJobStatusSchema = z.object({
  params: z.object({
    companyId: z.string().min(1),
    jobId: z.string().min(1),
  }),
  body: z.object({
    status: z.enum(["active", "closed", "draft"]),
  }),
});

const updateApplicationStatusSchema = z.object({
  params: z.object({
    companyId: z.string().min(1, "companyId is required"),
    applicationId: z.string().min(1, "applicationId is required"),
  }),
  body: z.object({
    status: z.enum(["applied", "reviewed", "interview", "hired", "rejected"]),
  }),
});

const getJobPostsSchema = z.object({
  params: z.object({
    jobId: z
      .string()
      .regex(/^[a-f\d]{24}$/, "Invalid job ID format")
      .optional(),
  }),
});

const deleteJobSchema = z.object({
  params: z.object({
    companyId: objectId(),
    jobId: objectId(),
  }),
});

export const deleteJobByIdSchema = z.object({
  params: z.object({
    id: objectId(),
  }),
});

const deleteApplicationSchema = z.object({
  params: z.object({
    jobId: objectId(),
    applicationId: objectId(),
  }),
});

export {
  postJobSchema,
  applySchema,
  statusUpdateSchema,
  getJobStatusSchema,
  getAllApplicationsSchema,
  updateJobStatusSchema,
  updateApplicationStatusSchema,
  getJobPostsSchema,
  deleteJobSchema,
  deleteApplicationSchema,
};
