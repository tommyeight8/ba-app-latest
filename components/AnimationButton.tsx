// components/AnimatedActionButton.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";

interface AnimatedActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  textColor?: string;
}

export function AnimatedActionButton({
  icon,
  label,
  onClick,
  color = "bg-black",
  textColor = "text-white",
}: AnimatedActionButtonProps) {
  return (
    <motion.button
      initial={{ width: 48 }}
      whileHover={{ width: 160 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={clsx(
        "h-12 overflow-hidden rounded-full flex items-center justify-center gap-2 px-4 transition-all duration-300",
        color,
        textColor
      )}
    >
      {icon}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="whitespace-nowrap text-sm font-medium"
      >
        {label}
      </motion.span>
    </motion.button>
  );
}
