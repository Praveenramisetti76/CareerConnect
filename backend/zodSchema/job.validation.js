import { z } from "zod";

const salaryRangeSchema = z.object({
  min: z.number().nonnegative().optional(),
  max: z.number().nonnegative().optional(),
}).refine(
  (data) => (data.min === undefined || data.max === undefined || data.min <= data.max),
  {
    message: "Minimum salary must be less than or equal to maximum salary.",
    path: ["min"],
  }
);

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  requirements: z.string().optional(),

  companyName: z.string().min(1, "Company name is required"),
  company: z.string().min(1, "Company ObjectId is required"),

  location: z.string().min(1, "Location is required"),
  type: z.enum([
    "full-time",
    "part-time",
    "internship",
    "contract",
    "freelance",
    "remote",
  ]),

  industry: z.string().optional(),
  salaryRange: salaryRangeSchema.optional(),

  applicationInstructions: z.string().optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
  logoPublicId: z.string().optional(),
});

export const updateJobSchema = createJobSchema.partial(); // Allow partial for editing
