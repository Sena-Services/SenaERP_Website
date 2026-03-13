"use client";

import Image from "next/image";
import NavBar from "@/components/nav/NavBar";
import { PageTransition, BackButton } from "@/components/shared/PageTransition";

const cofounders = [
  {
    name: "Aakash Chid",
    role: "Cofounder",
    email: "aakashchid@sena.services",
    twitter: "@aakashchid",
    twitterUrl: "https://twitter.com/aakashchid",
    linkedin: "linkedin.com/in/aakash-chid-k",
    linkedinUrl: "https://linkedin.com/in/aakash-chid-k",
    image: "/screenshots/aakash-cofounder.png",
  },
  {
    name: "Arun Viswanathan",
    role: "Cofounder",
    email: "arunvis@sena.services",
    twitter: "@_arvis8",
    twitterUrl: "https://twitter.com/_arvis8",
    linkedin: "linkedin.com/in/arvis8",
    linkedinUrl: "https://linkedin.com/in/arvis8",
    image: "/screenshots/arun-cofounder.png",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#F5F1E8" }}>
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 z-[200]"
        style={{ width: "min(640px, 90vw)" }}
      >
        <NavBar />
      </div>

      <PageTransition>
      <div
        className="mx-auto"
        style={{
          maxWidth: "720px",
          padding: "120px 24px 80px",
        }}
      >
        <BackButton fallbackHref="/?section=how-it-works#join-us" />

        {/* Title */}
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            color: "#2C1810",
            fontSize: "40px",
            marginBottom: "12px",
          }}
        >
          About <span style={{ fontStyle: "italic" }}>us</span>
        </h1>

        <p
          className="font-futura text-gray-600 leading-relaxed mb-12"
          style={{ fontSize: "16px", maxWidth: "560px" }}
        >
          We&apos;re building Sena — a platform where AI agents run real business operations. Not demos, not prototypes. Agents that handle economically useful work inside your ERP.
        </p>

        {/* Cofounders */}
        <div className="space-y-6">
          {cofounders.map((cofounder) => (
            <div
              key={cofounder.email}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#FCFCFA",
                border: "2px solid #9CA3AF",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex flex-col sm:flex-row">
                {cofounder.image && (
                  <div className="relative flex-shrink-0 sm:w-[180px]">
                    {/* Mobile: natural aspect ratio image */}
                    <div className="relative sm:hidden">
                      <Image
                        src={cofounder.image}
                        alt={cofounder.name}
                        width={400}
                        height={400}
                        className="w-full h-auto"
                        style={{ filter: "sepia(8%) saturate(95%)" }}
                      />
                      <div
                        className="absolute left-0 right-0 bottom-0 h-20"
                        style={{
                          background: "linear-gradient(to top, #FCFCFA 0%, transparent 100%)",
                        }}
                      />
                    </div>
                    {/* Desktop: fill container */}
                    <div className="relative w-full h-full hidden sm:block" style={{ minHeight: "240px" }}>
                      <Image
                        src={cofounder.image}
                        alt={cofounder.name}
                        fill
                        className="object-cover object-center"
                        style={{ filter: "sepia(8%) saturate(95%)" }}
                      />
                      <div
                        className="absolute top-0 bottom-0 right-0 w-16"
                        style={{
                          background: "linear-gradient(to left, #FCFCFA 0%, transparent 100%)",
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex-1 flex flex-col justify-center p-5 sm:p-6">
                  <div className="mb-3 sm:mb-4">
                    <h3
                      className="text-xl font-bold text-gray-900"
                      style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                    >
                      {cofounder.name}
                    </h3>
                    <p className="text-sm text-gray-600 italic font-futura">{cofounder.role}</p>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <a
                      href={`mailto:${cofounder.email}`}
                      className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-futura break-all">{cofounder.email}</span>
                    </a>

                    <a
                      href={cofounder.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span className="text-sm font-futura">{cofounder.twitter}</span>
                    </a>

                    <a
                      href={cofounder.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 text-gray-700 hover:text-gray-900 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      <span className="text-sm font-futura">{cofounder.linkedin}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </PageTransition>
    </main>
  );
}
