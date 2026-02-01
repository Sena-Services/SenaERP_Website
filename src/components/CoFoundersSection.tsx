"use client";

import { forwardRef, useEffect, useState } from "react";
import Image from "next/image";

const cofounders = [
  {
    name: "Aakash Chid",
    role: "Cofounder",
    phone: "+91 98417 97623",
    email: "aakashchid@sena.services",
    twitter: "@aakashchid",
    twitterUrl: "https://twitter.com/aakashchid",
    linkedin: "linkedin.com/in/aakash-chid-k",
    linkedinUrl: "https://linkedin.com/in/aakash-chid-k",
  },
  {
    name: "Arun Viswanathan",
    role: "Cofounder",
    phone: "+91 96770 18116",
    email: "arunvis@sena.services",
    twitter: "@_arvis8",
    twitterUrl: "https://twitter.com/_arvis8",
    linkedin: "linkedin.com/in/arvis8",
    linkedinUrl: "https://linkedin.com/in/arvis8",
  },
];

const CoFoundersSection = forwardRef<HTMLElement>(function CoFoundersSection(props, ref) {
  const [viewportHeight, setViewportHeight] = useState(900);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getResponsiveValue = (baseValue: number) => {
    const baseScreenHeight = 1200;
    if (viewportHeight <= baseScreenHeight) {
      return baseValue;
    }
    const scaleFactor = viewportHeight / baseScreenHeight;
    return baseValue * scaleFactor;
  };

  return (
    <section
      ref={ref}
      id="cofounders"
      className="scroll-mt-24"
      style={{
        paddingTop: '16px',
        paddingBottom: '16px',
      }}
    >
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          maxWidth: isMobile ? 'calc(100vw - 32px)' : 'min(1280px, calc(100vw - 320px))',
          paddingLeft: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backgroundColor: '#F5F3E8',
          border: '2px solid #9CA3AF',
          borderRadius: isMobile ? '24px' : `${getResponsiveValue(40)}px`,
          zIndex: 10,
        }}
      >
        {/* Section Title */}
        <div className="text-center pt-8 pb-4 md:pt-12 md:pb-6">
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: isMobile ? '28px' : '36px',
            }}
          >
            Meet the <span style={{ fontStyle: "italic" }}>CoFounders</span>
          </h2>
        </div>

        {/* Cofounder Image */}
        <div className="relative w-full flex justify-center px-4 md:px-8">
          <div
            className="relative w-full overflow-hidden"
            style={{
              maxWidth: '600px',
              borderRadius: '16px',
              border: '2px solid #9CA3AF',
            }}
          >
            <Image
              src="/screenshots/cofounders.png"
              alt="Aakash Chid and Arun Viswanathan - Cofounders of Sena"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              style={{
                filter: 'sepia(10%) saturate(90%)',
              }}
            />
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'} px-6 md:px-12 py-8`}>
          {cofounders.map((cofounder, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 p-5 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                border: '1px solid rgba(156, 163, 175, 0.3)',
              }}
            >
              <div className="mb-2">
                <h3
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {cofounder.name}
                </h3>
                <p className="text-sm text-gray-600 italic">{cofounder.role}</p>
              </div>

              {/* Phone */}
              <a
                href={`tel:${cofounder.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">{cofounder.phone}</span>
              </a>

              {/* Email */}
              <a
                href={`mailto:${cofounder.email}`}
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{cofounder.email}</span>
              </a>

              {/* Twitter */}
              <a
                href={cofounder.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm">{cofounder.twitter}</span>
              </a>

              {/* LinkedIn */}
              <a
                href={cofounder.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors group"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-sm">{cofounder.linkedin}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default CoFoundersSection;
