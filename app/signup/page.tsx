// "use client";

// import { useEffect } from "react";
// import { useSession, signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import SignUpForm from "@/components/Signup";
// import { signupAction } from "@/app/actions/signup";
// import { SignupFormData } from "@/lib/validators/authSchema";

// export default function SignupPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // ✅ Redirect if already signed in
//   useEffect(() => {
//     if (status === "authenticated") {
//       router.push("/dashboard");
//     }
//   }, [status, router]);

//   return <SignUpForm />;
// }
