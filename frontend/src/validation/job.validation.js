import { z } from "zod";

export const postJobSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  type: z.enum(
    ["full-time", "part-time", "internship", "contract", "freelance", "remote"],
    {
      errorMap: () => ({ message: "Please select a job type" }),
    }
  ),
  industry: z.string().optional(),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  applicationInstructions: z.string().optional(),
});
