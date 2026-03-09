"use client";

import { useRef, useEffect, useState, cloneElement, isValidElement } from "react";
import { motion, AnimatePresence } from "motion/react";

type WorkflowStep = {
  id: string;
  label: string;
  status?: "active" | "loading" | "complete";
};

type ChatMessage = {
  id: string;
  type: "agent" | "user";
  text: string;
  status?: string;
};

type DetailedContent = {
  title: string;
  description: string;
  capabilities?: Array<{
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  }>;
  features?: string[];
  footer?: string;
};

type Screenshot = {
  src: string;
  alt: string;
};

type MobileBuilderCardProps = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  accentColor: string;
  icon: React.ReactNode;
  demoComponent: React.ReactNode;
  workflowSteps?: WorkflowStep[];
  chatMessages?: ChatMessage[];
  detailedContent?: DetailedContent;
  screenshots?: Screenshot[];
  onVisibilityChange?: (isVisible: boolean) => void;
};

export default function MobileBuilderCard(props: MobileBuilderCardProps) {
  const {
    id,
    title,
    subtitle,
    description,
    icon,
    demoComponent,
    detailedContent,
    screenshots,
    onVisibilityChange,
  } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        onVisibilityChange?.(visible);
      },
      {
        threshold: 0.3,
        rootMargin: "-100px 0px -100px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [onVisibilityChange]);

  const goToNextScreenshot = () => {
    if (screenshots) {
      setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    }
  };

  const goToPrevScreenshot = () => {
    if (screenshots) {
      setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    }
  };

  const hasPrevScreenshot = currentScreenshot > 0;
  const hasNextScreenshot = screenshots ? currentScreenshot < screenshots.length - 1 : false;

  return (
    <div
      ref={cardRef}
      id={id}
      className="w-full relative"
    >
      {/* Card Container with earthy styling */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          border: '2px solid #9CA3AF',
          boxShadow: '0 4px 16px -4px rgba(139, 119, 89, 0.12)',
        }}
      >
        {/* Header Section */}
        <div className="p-4 pb-3 bg-[#F5F1E8]/50 border-b border-gray-200">
          {/* Badge and Toggle Row */}
          <div className="flex items-center justify-between mb-3">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: '#8FB7C5',
                border: '1.5px solid #8FB7C5',
              }}
            >
              <span className="text-white">{icon}</span>
              <span className="font-bold text-xs uppercase tracking-wide text-white">
                {title}
              </span>
            </div>

            {/* Animation / Details Toggle */}
            {screenshots && screenshots.length > 0 && (
              <div className="relative inline-flex items-center bg-[#F5F1E8] rounded-lg p-0.5 border border-[#D1D5DB]">
                <motion.div
                  className="absolute top-0.5 bottom-0.5 rounded-md bg-[#8FB7C5]"
                  initial={false}
                  animate={{
                    left: showDetails ? '50%' : '2px',
                    right: showDetails ? '2px' : '50%',
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
                <button
                  onClick={() => setShowDetails(false)}
                  className={`relative z-10 px-3 py-1 rounded-md text-[10px] font-semibold transition-colors duration-200 cursor-pointer ${
                    !showDetails ? 'text-white' : 'text-[#6B7280]'
                  }`}
                >
                  Animation
                </button>
                <button
                  onClick={() => setShowDetails(true)}
                  className={`relative z-10 px-3 py-1 rounded-md text-[10px] font-semibold transition-colors duration-200 cursor-pointer ${
                    showDetails ? 'text-white' : 'text-[#6B7280]'
                  }`}
                >
                  Details
                </button>
              </div>
            )}
          </div>

          {/* Subtitle */}
          <h3
            className="text-xl font-medium text-gray-900 mb-1"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              letterSpacing: "-0.01em",
            }}
          >
            {subtitle}
          </h3>

          {/* Description */}
          <p
            className="text-xs text-gray-600 leading-relaxed"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {description}
          </p>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <AnimatePresence mode="wait">
            {!showDetails ? (
              /* Animation View */
              <motion.div
                key="animation"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isValidElement(demoComponent)
                  ? cloneElement(demoComponent as React.ReactElement<{ isVisible: boolean }>, { isVisible })
                  : demoComponent}
              </motion.div>
            ) : (
              /* Details/Screenshots View */
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Screenshots Gallery */}
                {screenshots && screenshots.length > 0 && (
                  <div className="mb-4">
                    {/* Image */}
                    <div
                      className="relative rounded-xl overflow-hidden mb-3"
                      style={{
                        backgroundColor: '#FCFCFA',
                        border: '2px solid #9CA3AF'
                      }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={currentScreenshot}
                          src={screenshots[currentScreenshot].src}
                          alt={screenshots[currentScreenshot].alt}
                          className="w-full h-auto"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={goToPrevScreenshot}
                        disabled={!hasPrevScreenshot}
                        aria-label="Previous screenshot"
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          hasPrevScreenshot
                            ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white'
                            : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {screenshots.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentScreenshot(idx)}
                            aria-label={`Go to screenshot ${idx + 1}`}
                            className={`relative flex items-center justify-center transition-all duration-300 cursor-pointer`}
                            style={{ width: '44px', height: '44px', background: 'transparent', border: 'none', padding: 0 }}
                          >
                            <span
                              className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                idx === currentScreenshot
                                  ? 'bg-[#8FB7C5] scale-125'
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={goToNextScreenshot}
                        disabled={!hasNextScreenshot}
                        aria-label="Next screenshot"
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          hasNextScreenshot
                            ? 'border-[#8FB7C5] text-[#5B8A8A] hover:bg-[#8FB7C5] hover:text-white'
                            : 'border-gray-300 text-gray-300 cursor-not-allowed opacity-40'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Detailed Content */}
                {detailedContent && (
                  <div className="space-y-4">
                    {/* Core Capabilities */}
                    {detailedContent.capabilities && detailedContent.capabilities.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Core Capabilities
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {detailedContent.capabilities.map((capability, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 p-2 rounded-lg"
                              style={{ backgroundColor: '#F5F1E8' }}
                            >
                              <div className="flex-shrink-0 mt-0.5 text-[#8FB7C5]">
                                {capability.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 text-xs leading-tight">
                                  {capability.title}
                                </div>
                                <div className="text-[10px] text-gray-500 leading-snug">
                                  {capability.subtitle}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features List */}
                    {detailedContent.features && detailedContent.features.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                          Features
                        </h5>
                        <div className="space-y-1">
                          {detailedContent.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <svg className="w-3 h-3 flex-shrink-0 mt-0.5 text-[#8FB7C5]" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs text-gray-700 leading-relaxed">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    {detailedContent.footer && (
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-200 italic">
                        {detailedContent.footer}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
