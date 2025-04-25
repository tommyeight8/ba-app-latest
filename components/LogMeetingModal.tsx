"use client";

import { ReactNode } from "react";

export default function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white rounded-lg w-full max-w-xl shadow-xl relative p-6 transition-colors duration-200">
        <button
          className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-black 
          dark:hover:text-white text-xl cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
}
