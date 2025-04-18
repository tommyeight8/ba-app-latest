import { z } from "zod";

export const UserSignupSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  role: z.enum(["admin", "user"]).default("user"),
  password: z.string().min(6),
});

export type UserSignupValues = z.infer<typeof UserSignupSchema>;

// Admin login schema for validation
export const UserLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type UserLoginValues = z.infer<typeof UserLoginSchema>;
