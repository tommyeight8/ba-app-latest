"use client";

import FormSwitcher from "@/components/FormSwitcher";
import React, { useState } from "react";

export default function Page() {
  return (
    <div
      className="relative w-full h-screen flex items-center justify-center bg-black text-white
       flex-col"
    >
      <FormSwitcher />
    </div>
  );
}
