"use client";

import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import CareersSection from "@/components/CareersSection";
import { PageTransition } from "@/components/PageTransition";

export default function CareersPage() {
  const router = useRouter();

  return (
    <>
      <div className="fixed left-0 right-0 top-0 z-[200] flex justify-center">
        <div className="w-full max-w-4xl px-6 sm:px-8 lg:px-12">
          <NavBar
            showBackButton={true}
            onBackClick={() => router.back()}
            blogPageTitle="Careers"
          />
        </div>
      </div>
      <PageTransition>
        <div className="bg-sena-cream min-h-screen pt-16">
          <CareersSection />
        </div>
      </PageTransition>
    </>
  );
}
