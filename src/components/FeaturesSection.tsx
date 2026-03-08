"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  BarChart3,
  Megaphone,
  ShoppingCart,
  UserPlus,
  ClipboardList,
  CreditCard,
  Briefcase,
  LifeBuoy,
  Calculator,
} from "lucide-react";
import ScribbleUnderline from "./ScribbleUnderline";
import MarketingFeatureContent from "./MarketingFeatureContent";

const features = [
  {
    id: "marketing",
    name: "Marketing Suite",
    icon: Megaphone,
    description: "Connect with all your favorite tools",
    imageSrc: "/marketing.png",
  },
  {
    id: "sales",
    name: "Sales (Lead Ingestion)",
    icon: ShoppingCart,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
  {
    id: "crm-erp",
    name: "CRM/ERP",
    icon: UserPlus,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
  {
    id: "itinerary",
    name: "Itinerary",
    icon: ClipboardList,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
  {
    id: "booking-payments",
    name: "Booking & Payments",
    icon: CreditCard,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
  {
    id: "vendor-management",
    name: "Vendor Management",
    icon: Briefcase,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
  {
    id: "trip-assistance",
    name: "Trip Assistance",
    icon: LifeBuoy,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
  {
    id: "finance-accounting",
    name: "Finance & Accounting",
    icon: Calculator,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
  {
    id: "analytics",
    name: "Analytics",
    icon: BarChart3,
    description: "Connect with all your favorite tools",
    imageSrc: "/features1.png",
  },
];

export default function FeaturesSection() {
  const MANUAL_CONTROLS = {
    leftWidth: "w-[30%]",
    rightWidth: "w-[70%]",
    sidebarPadding: "py-8 pr-10 pl-10",
    sidebarSpacing: "space-y-1",
    itemPadding: "px-4 py-3",
    itemSpacing: "mb-1",
    iconSize: "w-6 h-6",
    textSize: "text-lg font-semibold tracking-wide",
    activeItemBg: "bg-sena-orange text-white",
    inactiveItemBg:
      "bg-transparent text-sena-text-primary hover:bg-sena-cream",
    activeIconColor: "text-white",
    inactiveIconColor: "text-sena-blue",
    imageMaxWidth: "max-w-[150%]",
    imageMaxHeight: "max-h-[100%]",
  };

  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = features.findIndex((f) => f.id === activeFeature);
    if (scrollContainerRef.current && featureRefs.current[activeIndex]) {
      const container = scrollContainerRef.current;
      const targetElement = featureRefs.current[activeIndex];
      if (targetElement) {
        const scrollLeft = targetElement.offsetLeft - container.offsetLeft;
        container.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  }, [activeFeature]);

  return (
    <section
      id="features"
      className="relative z-20 min-h-[90vh] flex flex-col pt-8 pb-8"
    >
      <div className="px-8 mb-1 lg:mb-2 xl:mb-[-0.5rem] 2xl:mb-16  ml-[.5rem]">
        <h2 className="font-rockwell text-sena-orange font-bold text-3xl tracking-wide">
          <ScribbleUnderline variant="features" color="#f59e0b" strokeWidth={8}>
            FEATURES
          </ScribbleUnderline>
        </h2>
      </div>

      <div className="flex flex-1 h-full">
        {/* LEFT SIDEBAR: Features List */}
        <div
          className={`${MANUAL_CONTROLS.leftWidth} border-r-4 border-sena-cream flex-shrink-0 h-full ml-[-1rem]`}
        >
          <div className={`${MANUAL_CONTROLS.sidebarPadding}`}>
            <div className={`${MANUAL_CONTROLS.sidebarSpacing}`}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const isActive = activeFeature === feature.id;

                return (
                  <div
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`
                      ${MANUAL_CONTROLS.itemPadding} 
                      ${MANUAL_CONTROLS.itemSpacing}
                      ${
                        isActive
                          ? MANUAL_CONTROLS.activeItemBg
                          : MANUAL_CONTROLS.inactiveItemBg
                      }
                      rounded-lg cursor-pointer transition-all duration-300 ease-in-out
                      group
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`
                          ${MANUAL_CONTROLS.iconSize} 
                          ${
                            isActive
                              ? MANUAL_CONTROLS.activeIconColor
                              : MANUAL_CONTROLS.inactiveIconColor
                          }
                          transition-colors duration-300
                        `}
                      />
                      <span className={`${MANUAL_CONTROLS.textSize}`}>
                        {index + 1}. {feature.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT AREA: Horizontal Scroller for Feature Details */}
        <div
          ref={scrollContainerRef}
          className={`${MANUAL_CONTROLS.rightWidth} flex  snap-x snap-mandatory h-full`}
        >
          {features.map((feature, index) => (
            <div
              key={feature.id}
              ref={(el) => {
                featureRefs.current[index] = el;
              }}
              className="w-full h-full flex-shrink-0 snap-center flex items-center justify-center"
            >
              {activeFeature === "marketing" && feature.id === "marketing" && (
                <MarketingFeatureContent />
              )}
              {activeFeature !== "marketing" &&
                feature.id === activeFeature && (
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-sena-blue">
                      {feature.name}
                    </h3>
                    <p className="text-sena-text-primary mt-2">
                      {feature.description}
                    </p>
                    {feature.imageSrc && (
                      <img
                        src={feature.imageSrc}
                        alt={feature.name}
                        className="mt-4 mx-auto max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg object-contain"
                      />
                    )}
                  </div>
                )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
