// // app/actions/auth/signup.ts
// "use server";

// import { signupSchema, SignupFormData } from "@/lib/validators/authSchema";
// import { prisma } from "@/lib/prisma";
// import { hash } from "bcryptjs";

// export async function signupAction(data: SignupFormData) {
//   const parsed = signupSchema.safeParse(data);

//   if (!parsed.success) {
//     throw new Error("Invalid form data");
//   }

//   const { email, password, firstName, lastName, ba_id, state } = parsed.data;

//   const existingUser = await prisma.user.findUnique({ where: { email } });
//   if (existingUser) throw new Error("User already exists");

//   const existingBA = await prisma.brandAmbassadorId.findUnique({
//     where: { ba_id },
//   });

//   if (!existingBA) throw new Error("BA ID not found");
//   if (existingBA.used) throw new Error("BA ID is already assigned");

//   const hashed = await hash(password, 10);

//   await prisma.user.create({
//     data: {
//       email,
//       password: hashed,
//       firstName,
//       lastName,
//       role: "user",
//       state,
//       ba_id,
//       brandAmbassador: {
//         connect: { ba_id },
//       },
//     },
//   });

//   // Mark the BA ID as used
//   await prisma.brandAmbassadorId.update({
//     where: { ba_id },
//     data: { used: true },
//   });
// }
