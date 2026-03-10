"use client";

import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export function PageTransition({ children, duration = 0.25 }: { children: React.ReactNode; duration?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="inline-flex items-center gap-1.5 font-futura text-gray-500 hover:text-gray-800 transition-colors mb-10 cursor-pointer"
      style={{ fontSize: "14px", background: "none", border: "none" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
