import { z } from "zod";

export const UserSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  role: z.enum(["admin", "user"]).default("user"),
  state: z.string().optional(),
  ba_id: z.string().optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserSignupValues = z.infer<typeof UserSignupSchema>;

// Admin login schema for validation
export const UserLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type UserLoginValues = z.infer<typeof UserLoginSchema>;
