import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),

  industry: z.string().min(1, "Industry is required"),

  size: z
    .enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"])
    .optional(),

  location: z.string().optional(),

  website: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Invalid website URL",
    }),

  foundedYear: z
    .number()
    .min(1950, "Year too old")
    .max(new Date().getFullYear(), "Year can't be in the future")
    .optional(),

  description: z.string().optional(),

  logo: z.string().optional(),
  logoPublicId: z.string().optional(),
  coverImage: z.string().optional(),
  coverImagePublicId: z.string().optional(),

  socialLinks: z
    .object({
      linkedin: z.url().optional(),
      twitter: z.url().optional(),
      github: z.url().optional(),
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
