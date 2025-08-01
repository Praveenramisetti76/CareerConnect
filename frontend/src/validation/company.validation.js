import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().trim().min(2, "Company name must be at least 2 characters long"),

  industry: z.string().trim().min(2, "Industry must be at least 2 characters long"),

  size: z
    .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .optional(),

  location: z.string().trim().min(1, "Location is required"),

  website: z
    .string()
    .min(1, "Website is required")
    .refine((val) => z.string().url().safeParse(val).success, {
      message: "Please enter a valid website URL (e.g., https://www.example.com)",
    }),

  foundedYear: z
    .number()
    .min(1950, "Founded year must be 1950 or later")
    .max(new Date().getFullYear(), "Founded year cannot be in the future"),

  description: z.string().trim().min(10, "Company description must be at least 10 characters long"),

  logo: z.string().optional(),
  logoPublicId: z.string().optional(),
  coverImage: z.string().optional(),
  coverImagePublicId: z.string().optional(),

  socialLinks: z
    .object({
      linkedin: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
      twitter: z.string().url("Please enter a valid Twitter URL").optional().or(z.literal("")),
      github: z.string().url("Please enter a valid GitHub URL").optional().or(z.literal("")),
    })
    .optional(),

  verified: z.boolean().optional(),

  roles: z
    .array(
      z.object({
        title: z.enum(["admin", "recruiter", "employee"]),
      })
    )
    .optional(),

  admins: z.array(z.string()).optional(),

  members: z
    .array(
      z.object({
        user: z.string(),
        role: z.enum(["admin", "recruiter", "employee"]),
      })
    )
    .optional(),

  joinRequests: z
    .array(
      z.object({
        user: z.string(),
        roleTitle: z.string(),
        status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
        requestedAt: z.date().optional(),
      })
    )
    .optional(),

  jobs: z.array(z.string()).optional(),
});
