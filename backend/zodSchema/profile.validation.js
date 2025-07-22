import { z } from "zod";

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
});

export const educationSchema = z.object({
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  start: z.string().min(1, "Start date is required"),
  end: z.string().min(1, "End date is required"),
  grade: z.string().min(1, "Grade is required"),
  description: z.string().min(1, "Description is required"),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  headline: z.string().optional(),
  about: z.string().optional(),
  location: z.string().optional(),
  skills: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  portfolio: z.string().optional(),
  openToWork: z.boolean().optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
});
