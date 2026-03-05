"use client";

import { forwardRef, useEffect, useState } from "react";

const GetAccessSection = forwardRef<HTMLElement>(function GetAccessSection(props, ref) {
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

  const handleGetAccess = () => {
    window.dispatchEvent(new CustomEvent('openSignupModal'));
  };

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent('openSignupModal'));
  };

  return (
    <section
      ref={ref}
      id="get-access"
      className="scroll-mt-24"
      style={{
        paddingTop: '16px',
        paddingBottom: isMobile ? '16px' : `${getResponsiveValue(40)}px`,
      }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: isMobile ? 'calc(100vw - 32px)' : 'min(1280px, calc(100vw - 320px))',
          paddingLeft: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          paddingRight: isMobile ? '0' : 'max(16px, min(32px, 2vw))',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          backgroundColor: '#F5F3E8',
          border: '2px solid #9CA3AF',
          minHeight: isMobile ? '280px' : `${getResponsiveValue(260)}px`,
          height: 'auto',
          maxHeight: isMobile ? 'none' : `${getResponsiveValue(380)}px`,
          overflow: 'hidden',
          borderRadius: isMobile ? '24px' : `${getResponsiveValue(40)}px`,
          zIndex: 10,
        }}
      >
        {/* Top right corner image */}
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: isMobile ? '160px' : `${getResponsiveValue(320)}px`,
            height: isMobile ? '160px' : `${getResponsiveValue(320)}px`,
            backgroundImage: 'url(/illustrations/joinus-topright.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'top right',
            backgroundRepeat: 'no-repeat',
            opacity: isMobile ? 0.4 : 0.7,
          }}
        />

        {/* Subtle gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(235, 229, 217, 0.2) 0%, rgba(235, 229, 217, 0.05) 50%, rgba(235, 229, 217, 0.2) 100%)',
            mixBlendMode: 'overlay',
            borderRadius: isMobile ? '24px' : `${getResponsiveValue(40)}px`,
          }}
        />

        {/* Content - left aligned */}
        <div
          className="relative h-full flex flex-col justify-center"
          style={{
            paddingTop: isMobile ? '40px' : `${getResponsiveValue(40)}px`,
            paddingBottom: isMobile ? '40px' : `${getResponsiveValue(40)}px`,
            paddingLeft: isMobile ? '28px' : `${getResponsiveValue(56)}px`,
            paddingRight: isMobile ? '28px' : `${getResponsiveValue(24)}px`,
          }}
        >
          <div style={{ maxWidth: isMobile ? '100%' : `${getResponsiveValue(560)}px`, display: 'flex', flexDirection: 'column', gap: isMobile ? '14px' : `${getResponsiveValue(14)}px` }}>
            {/* Heading */}
            <h2
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                color: "#2C1810",
                fontSize: isMobile ? '30px' : '38px',
                lineHeight: "1.2",
              }}
            >
              Ready to <span style={{ fontStyle: "italic" }}>build</span>?
            </h2>

            {/* Subtitle */}
            <p
              className="text-gray-700 font-futura"
              style={{
                maxWidth: isMobile ? '100%' : `${getResponsiveValue(480)}px`,
                letterSpacing: "-0.01em",
                fontSize: isMobile ? '14px' : '16px',
                lineHeight: 1.5,
              }}
            >
              Tell Sena what you need and it builds everything, tailored to how you actually work.
            </p>

            {/* CTA Button */}
            <div style={{ paddingTop: isMobile ? '6px' : `${getResponsiveValue(6)}px` }}>
              <button
                onClick={handleGetAccess}
                className="inline-flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap font-semibold cursor-pointer outline-none leading-none focus-visible:outline-none"
                style={{
                  background: '#8FB7C5',
                  border: '1px solid #7AA5B5',
                  borderRadius: '9999px',
                  color: '#FFFFFF',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  boxShadow: '0 4px 12px rgba(143, 183, 197, 0.3)',
                  paddingLeft: isMobile ? '28px' : `${getResponsiveValue(36)}px`,
                  paddingRight: isMobile ? '28px' : `${getResponsiveValue(36)}px`,
                  paddingTop: isMobile ? '12px' : `${getResponsiveValue(14)}px`,
                  paddingBottom: isMobile ? '12px' : `${getResponsiveValue(14)}px`,
                  fontSize: isMobile ? '15px' : `${getResponsiveValue(16)}px`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#7AA5B5';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(143, 183, 197, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#8FB7C5';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(143, 183, 197, 0.3)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Get Access
              </button>
            </div>

            {/* Secondary text */}
            <p
              className="font-futura text-gray-600"
              style={{
                fontSize: isMobile ? '12px' : `${getResponsiveValue(13)}px`,
              }}
            >
              Already have an account?{' '}
              <button
                onClick={handleLogin}
                className="underline hover:text-gray-900 transition-colors cursor-pointer"
                style={{ background: 'none', border: 'none', font: 'inherit', color: 'inherit' }}
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default GetAccessSection;
