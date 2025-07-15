import { z } from "zod";

export const signUpSchema = z.object({
  name: z.string().min(3, "Username must be atleast 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  role: z.enum(["candidate", "recruiter"], {
    required_error: "Role is required",
  }),
});

export const logInSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export type registerInput = z.infer<typeof signUpSchema>
export type logInInput = z.infer<typeof logInSchema>
