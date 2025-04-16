"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginForm from "@/components/LoginForm";
import { loginAction } from "@/app/actions/login";
import { LoginFormData } from "@/lib/validators/authSchema";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleLogin = async (data: LoginFormData) => {
    try {
      // ✅ Optional schema check before signIn
      await loginAction(data);

      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        throw new Error("Invalid email or password.");
      }

      // ✅ Redirect to callback or dashboard
      router.push(res?.url || "/dashboard");
    } catch (err: any) {
      console.error(err.message || "Login failed");
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
}
