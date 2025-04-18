"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginForm from "@/components/LoginForm";
import { loginAction } from "@/app/actions/login";
import { LoginFormData } from "@/lib/validators/authSchema";

export default function LoginPage() {
  return <LoginForm />;
}
