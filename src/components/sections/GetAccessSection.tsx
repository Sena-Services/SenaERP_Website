"use client";

import { forwardRef } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const GetAccessSection = forwardRef<HTMLElement>(function GetAccessSection(props, ref) {
  const isMobile = useIsMobile();

  const handleLogin = () => {
    window.dispatchEvent(new CustomEvent('openSignupModal'));
  };

  return (
    <section
      ref={ref}
      id="get-access"
      className="scroll-mt-24"
      style={{
        paddingTop: isMobile ? "24px" : "32px",
        paddingBottom: isMobile ? "24px" : "32px",
      }}
    >
      <div
        className="relative mx-auto"
        style={{
          maxWidth: isMobile ? "calc(100vw - 32px)" : "min(480px, calc(100vw - 400px))",
        }}
      >
        <div
          className="text-center"
          style={{
            backgroundColor: "#F5F3E8",
            border: "2px solid #9CA3AF",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: isMobile ? "24px" : "40px",
            padding: isMobile ? "36px 24px" : "48px 40px",
            overflow: "hidden",
          }}
        >
          {/* Heading */}
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: isMobile ? "26px" : "32px",
              lineHeight: "1.2",
              marginBottom: "8px",
            }}
          >
            Ready to <span style={{ fontStyle: "italic" }}>build</span>?
          </h2>

          {/* Subtitle */}
          <p
            className="text-gray-500 font-futura mx-auto leading-relaxed"
            style={{
              maxWidth: "360px",
              fontSize: isMobile ? "13px" : "14px",
              marginBottom: "20px",
            }}
          >
            Tell Sena what you need and it builds everything for you.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleLogin}
            className="inline-flex items-center justify-center transition-all duration-300 ease-out whitespace-nowrap font-semibold cursor-pointer outline-none leading-none focus-visible:ring-2 focus-visible:ring-[#8FB7C5] focus-visible:ring-offset-2"
            style={{
              background: "#8FB7C5",
              border: "1px solid #7AA5B5",
              borderRadius: "9999px",
              color: "#FFFFFF",
              fontFamily: "system-ui, -apple-system, sans-serif",
              boxShadow: "0 2px 8px rgba(143, 183, 197, 0.3)",
              padding: isMobile ? "10px 28px" : "12px 36px",
              fontSize: isMobile ? "14px" : "15px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#7AA5B5";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(143, 183, 197, 0.4)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#8FB7C5";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(143, 183, 197, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Login
          </button>

          {/* Secondary text */}
          <p
            className="font-futura text-gray-400 mt-3"
            style={{ fontSize: isMobile ? "11px" : "12px" }}
          >
            Don&apos;t have an account?{" "}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openSignupModal', { detail: { view: 'signup' } }))}
              className="underline hover:text-gray-700 transition-colors cursor-pointer"
              style={{ background: "none", border: "none", font: "inherit", color: "inherit" }}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </section>
  );
});

export default GetAccessSection;
