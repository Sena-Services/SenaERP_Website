"use client";

import { useRef, useEffect, useState, cloneElement, isValidElement } from "react";
import { motion } from "framer-motion";

type MobileBuilderCardProps = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  accentColor: string;
  icon: React.ReactNode;
  demoComponent: React.ReactNode;
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
  onVisibilityChange,
}: MobileBuilderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio > 0.5;
        setIsVisible(visible);
        onVisibilityChange?.(visible);
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: "-20px",
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
      className="w-full relative mb-12 px-4"
      style={{
        minHeight: "calc(100vh - 120px)",
      }}
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

      {/* Demo Section - Only animate this when visible */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        {isValidElement(demoComponent)
          ? cloneElement(demoComponent, { isVisible } as any)
          : demoComponent}
      </motion.div>

      {/* Features Section - Prerendered, no fade-in */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          What you can build
        </h4>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span
                className="mt-1 flex-shrink-0"
                style={{ color: accentColor }}
              >
                •
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
