"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginForm from "@/components/LoginForm";
import { loginAction } from "@/app/actions/login";
import { LoginFormData } from "@/lib/validators/authSchema";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: LoginFormData) => {
    await loginAction(data); // optional, for early validation

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      throw new Error("Invalid email or password.");
    }

    router.push("/dashboard");
  };

  return <LoginForm onSubmit={handleLogin} />;
}
