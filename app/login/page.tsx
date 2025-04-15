"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginForm from "@/components/LoginForm";
import { loginAction } from "@/app/actions/login";
import { LoginFormData } from "@/lib/validators/authSchema";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    await loginAction(data);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      throw new Error("Invalid email or password.");
    }

    // 👇 Force session refresh before navigating
    const sessionRes = await fetch("/api/auth/session");
    if (sessionRes.ok) {
      router.push("/dashboard");
    } else {
      console.error("Session not established");
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
