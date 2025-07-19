import { z } from "zod";

const objectId = () =>
  z.string().regex(/^[a-f\d]{24}$/, "Invalid ObjectId format");

export const createArticleSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string().min(1)).optional(),
});

export const updateArticleSchema = z.object({
  params: z.object({
    articleId: objectId(),
  }),
  body: z
    .object({
      title: z.string().min(2).optional(),
      content: z.string().min(10).optional(),
      tags: z.array(z.string().min(1)).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
});

export const getArticleSchema = z.object({
  articleId: objectId(),
});
