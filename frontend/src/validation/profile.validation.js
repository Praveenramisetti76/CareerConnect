import { z } from "zod";

export const profileValidationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  headline: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  isOpenToWork: z.boolean().optional(),
  social: z
    .object({
      github: z.string().url("Invalid URL").optional().or(z.literal("")),
      linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
      twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
      portfolio: z.string().url("Invalid URL").optional().or(z.literal("")),
    })
    .optional(),
});

export const experienceSchema = z
  .object({
    title: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company name is required"),
    location: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "Start date must be before end date",
      path: ["endDate"],
    }
  );

export const educationSchema = z
  .object({
    degree: z.string().min(1, "Degree is required"),
    school: z.string().min(1, "School name is required"),
    fieldOfStudy: z.string().optional(),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    grade: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "Start date must be before end date",
      path: ["endDate"],
    }
  );
