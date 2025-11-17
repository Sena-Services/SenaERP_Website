"use client";

import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import CareersSection from "@/components/CareersSection";

export default function CareersPage() {
  const router = useRouter();

  return (
    <>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[200]" style={{ width: "min(640px, 90vw)" }}>
        <NavBar />
      </div>
      <div className="bg-waygent-cream min-h-screen pt-16">
        <CareersSection onBackClick={() => router.back()} />
      </div>
    </>
  );
}
