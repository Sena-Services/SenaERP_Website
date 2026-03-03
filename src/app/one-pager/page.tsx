"use client";

import { useRouter } from "next/navigation";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function OnePager() {
  const router = useRouter();

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [],
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullScreen: (zoom) => {
          zoom(0.5);
        },
        onExitFullScreen: (zoom) => {
          zoom(0.2);
        },
      },
    },
  });

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #f8f5f0 0%, #ebe4d8 50%, #e0d6c8 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
            style={{
              color: "#5a4938",
              background: "rgba(139, 115, 85, 0.1)",
              border: "1px solid rgba(139, 115, 85, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(139, 115, 85, 0.2)";
              e.currentTarget.style.transform = "translateX(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(139, 115, 85, 0.1)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <a
            href="/documents/sena-one-pager.pdf"
            download="Sena-One-Pager.pdf"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #8b7355 0%, #6b5744 100%)",
              color: "white",
              boxShadow: "0 4px 14px rgba(90, 73, 56, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(90, 73, 56, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(90, 73, 56, 0.3)";
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </a>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="text-6xl md:text-7xl mb-3"
            style={{
              fontFamily: "'Tangerine', 'Georgia', cursive",
              fontWeight: 700,
              color: "#5a4938",
              textShadow: "0 2px 4px rgba(90, 73, 56, 0.1)",
            }}
          >
            Sena One Pager
          </h1>
          <p
            className="tracking-wide"
            style={{
              fontFamily: "Georgia, serif",
              color: "#8b7355",
              fontSize: "16px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            The Agentic Enterprise Platform
          </p>
        </div>

        {/* PDF Viewer Container */}
        <div
          className="rounded-2xl overflow-hidden mx-auto"
          style={{
            width: "100%",
            height: "calc(100vh - 280px)",
            minHeight: "600px",
            boxShadow: "0 20px 60px rgba(90, 73, 56, 0.2), 0 8px 24px rgba(90, 73, 56, 0.1)",
            border: "1px solid rgba(139, 115, 85, 0.15)",
            background: "#fff",
          }}
        >
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <div
              style={{
                height: "100%",
                width: "100%",
              }}
              className="pdf-viewer-container"
            >
              <Viewer
                fileUrl="/documents/sena-one-pager.pdf"
                plugins={[defaultLayoutPluginInstance]}
                defaultScale={0.2}
              />
            </div>
          </Worker>
        </div>

        {/* Info text */}
        <p
          className="text-center mt-6 text-sm tracking-wide"
          style={{ color: "#a08b70" }}
        >
          Use toolbar to zoom & navigate • Scroll to explore • Download for offline viewing
        </p>
      </div>

      <style jsx global>{`
        .pdf-viewer-container .rpv-core__viewer {
          background: #f5f5f5 !important;
        }
        .pdf-viewer-container .rpv-default-layout__toolbar {
          background: linear-gradient(to bottom, #faf8f5, #f5f2ed) !important;
          border-bottom: 1px solid rgba(139, 115, 85, 0.15) !important;
        }
        .pdf-viewer-container .rpv-core__minimal-button {
          color: #5a4938 !important;
        }
        .pdf-viewer-container .rpv-core__minimal-button:hover {
          background: rgba(139, 115, 85, 0.1) !important;
        }
        .pdf-viewer-container .rpv-default-layout__body {
          background: #e8e4de !important;
        }
        .pdf-viewer-container .rpv-core__inner-page {
          background: white !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
