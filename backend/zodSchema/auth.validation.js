import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["candidate", "recruiter"], {
    required_error: "Role is required",
  }),
});

export const updateUserRoleSchema = z.object({
  newRole: z.enum(["candidate", "recruiter"]),
});

export const logInSchema = z.object({
  email: z.email(),
  password: z.string(),
  otp: z.string().optional()
});

export const resetPasswordParamsSchema = z.object({
  token: z.string().min(1, "Token is required"),
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
});

export const resetPasswordBodySchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
});
