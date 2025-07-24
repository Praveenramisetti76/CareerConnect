import { z } from "zod";

// ── Enums ──
export const CompanySizeEnum = z.enum([
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
]);

export const RoleTitleEnum = z.enum(["admin", "recruiter", "employee"]);

// ── MongoDB ObjectId Validator ──
export const objectId = z
  .string()
  .pipe(z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"));

// ── 1. Create Company ──
export const createCompanySchema = z.object({
  name: z.string().min(2),
  industry: z.string().min(2),
  size: CompanySizeEnum.optional(),
  location: z.string().optional(),
  website: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  foundedYear: z.number().min(1950).max(new Date().getFullYear()).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  logoPublicId: z.string().optional(),
  coverImage: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
  socialLinks: z
    .object({
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
});

export const getMyCompanyRoleSchema = z.object({
  id: z.string().length(24, "Invalid company ID"),
});

// ── 2. Update Company ──
export const updateCompanySchema = createCompanySchema.partial();

// ── 3. Request to Join ──
export const requestToJoinSchema = z.object({
  roleTitle: RoleTitleEnum,
});

// ── 4. Handle Join Request ──
export const handleJoinRequestSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

// ── 5. Update Company Role ──
export const updateCompanyRoleSchema = z.object({
  roleTitle: RoleTitleEnum,
});
