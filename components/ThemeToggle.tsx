// components/ThemeToggle.tsx
"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.button
        key={theme} // forces re-render when theme changes
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded transition cursor-pointer"
        initial={{ rotate: 90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: -90, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-200" />
        ) : (
          <Moon className="w-5 h-5 text-blue-300" />
        )}
      </motion.button>
    </AnimatePresence>
  );
}
