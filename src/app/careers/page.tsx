"use client";

import Link from "next/link";
import NavBar from "@/components/NavBar";
import CareersSection from "@/components/CareersSection";

export default function CareersPage() {
  return (
    <>
      <NavBar />
      <div className="bg-waygent-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-waygent-blue hover:text-waygent-blue-hover font-space-grotesk transition mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </div>
        <CareersSection />
      </div>
    </>
  );
}
