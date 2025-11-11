"use client";

import { forwardRef, useEffect, useState } from "react";
import Link from "next/link";

const socialLinks = [
  {
    name: "Twitter",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "LinkedIn",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "GitHub",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
    href: "#",
  },
  {
    name: "Discord",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
      </svg>
    ),
    href: "#",
  },
];

const JoinUsSection = forwardRef<HTMLElement>(function JoinUsSection(props, ref) {
  const [viewportHeight, setViewportHeight] = useState(900);

  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive scaling: only scale up when viewport HEIGHT > 1200px
  const getResponsiveValue = (baseValue: number) => {
    const baseScreenHeight = 1200;
    if (viewportHeight <= baseScreenHeight) {
      return baseValue;
    }
    // Scale proportionally for screens taller than 1200px
    const scaleFactor = viewportHeight / baseScreenHeight;
    return baseValue * scaleFactor;
  };

  return (
    <section
      ref={ref}
      id="join-us"
      className="scroll-mt-24 mt-32 sm:mt-48 px-4 sm:px-6 lg:px-8 mb-8"
      style={{
        paddingBottom: `${getResponsiveValue(64)}px`,
      }}
    >
      <div
        className="relative max-w-7xl mx-auto"
        style={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backgroundColor: '#F5F3E8',
          minHeight: `${getResponsiveValue(320)}px`,
          height: 'auto',
          maxHeight: `${getResponsiveValue(400)}px`,
          overflow: 'hidden',
          borderRadius: `${getResponsiveValue(40)}px`,
        }}
      >
        {/* Bottom left corner image */}
        <div
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{
            width: `${getResponsiveValue(360)}px`,
            height: `${getResponsiveValue(360)}px`,
            backgroundImage: 'url(/illustrations/joinus-bottomleft.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom left',
            backgroundRepeat: 'no-repeat',
            opacity: 0.88
          }}
        />

        {/* Top right corner image */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: `${getResponsiveValue(360)}px`,
            height: `${getResponsiveValue(360)}px`,
            backgroundImage: 'url(/illustrations/joinus-topright.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'top right',
            backgroundRepeat: 'no-repeat',
            opacity: 0.88
          }}
        />

        {/* Subtle gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(235, 229, 217, 0.2) 0%, rgba(235, 229, 217, 0.05) 50%, rgba(235, 229, 217, 0.2) 100%)',
            mixBlendMode: 'overlay',
            borderRadius: `${getResponsiveValue(40)}px`,
          }}
        />

        {/* Content - centered */}
        <div
          className="relative h-full flex flex-col items-center justify-center text-center"
          style={{
            paddingTop: `${getResponsiveValue(32)}px`,
            paddingBottom: `${getResponsiveValue(32)}px`,
            paddingLeft: `${getResponsiveValue(24)}px`,
            paddingRight: `${getResponsiveValue(24)}px`,
          }}
        >
          <div style={{ maxWidth: `${getResponsiveValue(672)}px`, display: 'flex', flexDirection: 'column', gap: `${getResponsiveValue(16)}px` }}>
            {/* Main heading */}
            <div>
              <h2
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  color: "#2C1810",
                  fontSize: `${getResponsiveValue(48)}px`,
                  marginBottom: `${getResponsiveValue(8)}px`,
                  lineHeight: "1.2",
                }}
              >
                Join our team
              </h2>
              <p
                className="font-futura font-medium mx-auto"
                style={{
                  fontSize: `${getResponsiveValue(18)}px`,
                  color: '#4B5563',
                  maxWidth: `${getResponsiveValue(576)}px`,
                }}
              >
                Help us build the future of business software
              </p>
            </div>

            {/* Social links */}
            <div
              className="flex items-center justify-center py-2"
              style={{ gap: `${getResponsiveValue(16)}px` }}
            >
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="group relative flex items-center justify-center rounded-full bg-white/70 backdrop-blur-md border border-gray-200/50 shadow-md hover:shadow-xl hover:bg-white transition-all duration-300 hover:-translate-y-1"
                  style={{
                    width: `${getResponsiveValue(48)}px`,
                    height: `${getResponsiveValue(48)}px`,
                  }}
                >
                  <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {social.icon}
                  </span>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div style={{ paddingTop: `${getResponsiveValue(4)}px` }}>
              <Link
                href="/careers"
                className="inline-flex items-center rounded-full bg-white text-gray-700 font-futura font-bold shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-gray-50 transition-all duration-300 hover:-translate-y-1 border-2 border-gray-200"
                style={{
                  gap: `${getResponsiveValue(8)}px`,
                  paddingLeft: `${getResponsiveValue(28)}px`,
                  paddingRight: `${getResponsiveValue(28)}px`,
                  paddingTop: `${getResponsiveValue(12)}px`,
                  paddingBottom: `${getResponsiveValue(12)}px`,
                  fontSize: `${getResponsiveValue(16)}px`,
                }}
              >
                <span>View open positions</span>
                <svg
                  className="group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  style={{
                    width: `${getResponsiveValue(16)}px`,
                    height: `${getResponsiveValue(16)}px`,
                  }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Optional tagline */}
            <p
              className="font-futura text-gray-600"
              style={{
                fontSize: `${getResponsiveValue(12)}px`,
                paddingTop: `${getResponsiveValue(4)}px`,
              }}
            >
              Remote-friendly · Competitive benefits · Growing team
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default JoinUsSection;
