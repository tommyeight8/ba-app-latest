import { z } from "zod";

// export const UserSignupSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   firstName: z.string(),
//   lastName: z.string(),
//   state: z.string(),
//   ba_id: z.string().min(1, "BA ID is required"),
// });

export const UserSignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string(),
  lastName: z.string(),
  state: z.string(),
});

export type UserSignupValues = z.infer<typeof UserSignupSchema>;

// Admin login schema for validation
export const UserLoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type UserLoginValues = z.infer<typeof UserLoginSchema>;
