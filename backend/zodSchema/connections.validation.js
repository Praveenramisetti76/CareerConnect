import { z } from "zod";

// For sending a request
export const sendConnectionRequestSchema = z.object({
  recipientId: z.string().min(1, "Recipient ID is required"),
});

// For cancelling a request
export const cancelConnectionRequestSchema = z.object({
  recipient: z.string().min(1, "Recipient ID is required"),
});

// For accepting/rejecting a request
export const respondConnectionRequestSchema = z.object({
  requester: z.string().min(1, "Recipient ID is required"),
});

// For removing a connection
export const removeConnectionSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
});
