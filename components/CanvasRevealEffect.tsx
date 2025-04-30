"use client";
import React, { useState } from "react";

import SignUpForm from "@/components/Signup";
import LoginForm from "@/components/LoginForm"; // 👈 Make sure you have this component
import { WavyBackground } from "./ui/wavy-background";

export default function CanvasRevealEffectDemo3() {
  const [hovered, setHovered] = useState(false);
  const [formType, setFormType] = useState<"signup" | "login">("signup");

  return (
    <>
      <div
        className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2  w-full max-w-[500px]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {formType === "signup" ? <SignUpForm /> : <LoginForm />}

        <button
          onClick={() =>
            setFormType((prev) => (prev === "signup" ? "login" : "signup"))
          }
          className="mt-4 text-sm text-gray-300 hover:text-white transition m-auto block cursor-pointer"
        >
          {formType === "signup"
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </div>

      <div className="h-screen flex flex-col lg:flex-row overflow-hidden items-center justify-center bg-black w-full gap-4 mx-auto px-8 relative">
        <WavyBackground />
        <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black dark:bg-black/90" />
      </div>
    </>
  );
}
