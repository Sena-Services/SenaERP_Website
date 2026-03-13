"use client";

import { useState, useEffect } from "react";
import NextImage from "next/image";

const CRITICAL_IMAGES = [
  "/sena-logo-pinwheel.png",
  "/sena-logo-stick.png",
  "/sena-wordmark.png",
  "/illustrations/monet-intro.png",
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function LoadingScreen() {
  const [phase, setPhase] = useState<"entering" | "visible" | "exiting" | "gone">("entering");

  useEffect(() => {
    const minDelay = new Promise<void>((r) => setTimeout(r, 800));
    const images = Promise.all(CRITICAL_IMAGES.map(preloadImage));

    // Show entering animation, then wait for images + min delay
    const enterTimer = setTimeout(() => setPhase("visible"), 600);

    Promise.all([minDelay, images]).then(() => {
      // Auto-dismiss once everything is loaded
      setPhase("exiting");
      setTimeout(() => setPhase("gone"), 800);
    });

    return () => clearTimeout(enterTimer);
  }, []);

  if (phase === "gone") return null;

  const isEntering = phase === "entering";
  const isExiting = phase === "exiting";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#F5F1E8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        opacity: isExiting ? 0 : 1,
        transition: "opacity 0.7s ease-out",
        pointerEvents: isExiting ? "none" : "auto",
        cursor: phase === "visible" ? "pointer" : "default",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes loadingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gentleBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 0.45; transform: translateY(0); }
        }
        @keyframes softGlow {
          0%, 100% { opacity: 0.08; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.15; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes orbFloat1 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -20px); }
          66% { transform: translate(-20px, 15px); }
        }
        @keyframes orbFloat2 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(-25px, 25px); }
          66% { transform: translate(35px, -10px); }
        }
        @keyframes orbFloat3 {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(15px, 30px); }
          66% { transform: translate(-30px, -25px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(15deg); }
          100% { transform: translateX(100%) rotate(15deg); }
        }
      `}</style>


      {/* Floating orbs — warm earthy colors drifting slowly */}
      <div
        style={{
          position: "absolute",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(210,170,120,0.1) 0%, transparent 70%)",
          top: "20%",
          left: "25%",
          animation: "orbFloat1 8s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "220px",
          height: "220px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(143,183,197,0.08) 0%, transparent 70%)",
          bottom: "15%",
          right: "20%",
          animation: "orbFloat2 10s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "140px",
          height: "140px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,100,110,0.06) 0%, transparent 70%)",
          top: "60%",
          left: "15%",
          animation: "orbFloat3 12s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `
            linear-gradient(rgba(120,100,80,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,100,80,0.6) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Logo container */}
      <div
        style={{
          position: "relative",
          width: "160px",
          height: "200px",
          zIndex: 2,
          animation: isEntering
            ? "fadeInScale 0.6s ease-out both"
            : isExiting
            ? undefined
            : "gentleBreathe 3s ease-in-out infinite",
          transform: isExiting ? "scale(1.1)" : undefined,
          transition: isExiting ? "transform 0.7s ease-out, opacity 0.7s ease-out" : undefined,
          opacity: isExiting ? 0 : 1,
        }}
      >
        {/* Stick */}
        <NextImage
          src="/sena-logo-stick.png"
          alt=""
          width={140}
          height={140}
          style={{
            position: "absolute",
            height: "auto",
            left: "50%",
            top: "30px",
            transform: "translateX(-50%)",
            clipPath: "inset(0 0 20% 0)",
            zIndex: 1,
          }}
        />
        {/* Pinwheel */}
        <div
          style={{
            position: "absolute",
            width: "130px",
            height: "130px",
            left: "50%",
            top: "8px",
            marginLeft: "-58px",
            zIndex: 2,
          }}
        >
          <NextImage
            src="/sena-logo-pinwheel.png"
            alt="Sena"
            width={130}
            height={130}
            style={{
              transformOrigin: "center center",
              animation: "loadingSpin 3s linear infinite",
            }}
          />
        </div>
      </div>

      {/* SENA text */}
      <h1
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 400,
          fontSize: "22px",
          color: "#2C1810",
          letterSpacing: "0.12em",
          fontStyle: "italic",
          marginTop: "8px",
          zIndex: 2,
          animation: "fadeInUp 0.6s ease-out 0.3s both",
          opacity: isExiting ? 0 : undefined,
          transition: isExiting ? "opacity 0.4s ease-out" : undefined,
        }}
      >
        SENA
      </h1>

      {/* Thin progress-like line at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "2px",
          borderRadius: "1px",
          background: "rgba(44,24,16,0.08)",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: "30px",
            height: "100%",
            borderRadius: "1px",
            background: "rgba(143,183,197,0.5)",
            animation: "shimmer 1.5s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
