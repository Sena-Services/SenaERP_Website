"use client";

import { useRef, useEffect, useState, cloneElement, isValidElement } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  onVisibilityChange?: (isVisible: boolean) => void;
};

export default function MobileBuilderCard({
  id,
  title,
  subtitle,
  description,
  features,
  accentColor,
  icon,
  demoComponent,
  workflowSteps,
  chatMessages,
  detailedContent,
  onVisibilityChange,
}: MobileBuilderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        onVisibilityChange?.(visible);
      },
      {
        threshold: 0.3, // Card must be 30% visible to be considered active
        rootMargin: "-100px 0px -100px 0px", // Only trigger when well into viewport
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [onVisibilityChange]);

  return (
    <div
      ref={cardRef}
      id={id}
      className="w-full relative mb-6 px-4"
    >
      {/* Header Section - Prerendered, no fade-in */}
      <div className="mb-6">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
          style={{
            backgroundColor: `${accentColor}15`,
            border: `1.5px solid ${accentColor}`,
          }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
          <span
            className="font-bold text-xs uppercase tracking-wide"
            style={{ color: accentColor }}
          >
            {title}
          </span>
        </div>

        {/* Subtitle */}
        <h3
          className="text-2xl font-medium text-gray-900 mb-2"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            letterSpacing: "-0.01em",
          }}
        >
          {subtitle}
        </h3>

        {/* Description */}
        <p
          className="text-sm text-gray-600 leading-relaxed"
          style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          {description}
        </p>
      </div>

      {/* Demo Section - Always rendered, just pass visibility state */}
      <div className="mb-6">
        {isValidElement(demoComponent)
          ? cloneElement(demoComponent, { isVisible } as any)
          : demoComponent}
      </div>

      {/* Expandable "Details" section */}
      {detailedContent && (
        <div className={`transition-all duration-300 ${isExpanded ? 'mt-2' : 'mt-0'}`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-3 px-4 rounded-xl border-2 transition-all"
            style={{
              borderColor: isExpanded ? accentColor : '#E5E7EB',
              backgroundColor: isExpanded ? `${accentColor}08` : 'white',
            }}
          >
            <span className="text-sm font-semibold" style={{ color: isExpanded ? accentColor : '#374151' }}>
              {detailedContent ? 'View Details' : 'See how it builds'}
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: accentColor }}
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="mt-4 space-y-6">
                  {/* Detailed Content */}
                  {detailedContent && (
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <h4 className="text-base font-bold text-gray-900 mb-1.5" style={{ fontFamily: "Georgia, serif" }}>
                          {detailedContent.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {detailedContent.description}
                        </p>
                      </div>

                      {/* Core Capabilities */}
                      {detailedContent.capabilities && detailedContent.capabilities.length > 0 && (
                        <div>
                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                            Core Capabilities
                          </h5>
                          <div className="space-y-2.5">
                            {detailedContent.capabilities.map((capability, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <div className="flex-shrink-0 mt-0.5" style={{ color: accentColor }}>
                                  {capability.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 text-sm leading-tight mb-0.5">
                                    {capability.title}
                                  </div>
                                  <div className="text-xs text-gray-500 leading-snug">
                                    {capability.subtitle}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {detailedContent.footer && (
                            <div className="text-xs text-gray-500 pt-2.5 mt-2.5 border-t border-gray-200">
                              {detailedContent.footer}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Features List */}
                      {detailedContent.features && detailedContent.features.length > 0 && (
                        <div>
                          <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                            Features
                          </h5>
                          <div className="space-y-1.5">
                            {detailedContent.features.map((feature, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: accentColor }}>
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-xs text-gray-700 leading-relaxed">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
