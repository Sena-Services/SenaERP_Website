"use client";

import { useState, ChangeEvent, forwardRef } from "react";
import Link from "next/link";
import Image from "next/image";

// New simple configuration
const MIN_CREDITS = 4000;
const MAX_CREDITS = 25001;
const NUM_BARS = 50;

// Bar height configuration - more compact
const BASE_BAR_HEIGHT = 6; // Unselected bars
const ELEVATED_BAR_HEIGHT = 16; // Selected bars

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "INR", symbol: "₹" },
];

const pricingTiers = [
  {
    plan: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: "Perfect for trying Sena",
    maxCredits: 1000,
    features: [
      "Live knowledgebase",
      "Weekly AI digests",
      "Up to 3 teammates",
      "Email support",
      "Basic integrations"
    ],
  },
  {
    plan: "Pro",
    monthlyPrice: 39,
    annualPrice: 29,
    tagline: "per user / month",
    maxCredits: 100000,
    features: [
      "Everything in Free",
      "Unlimited automations",
      "CRM sync",
      "Daily AI digests",
      "Priority support",
      "Advanced integrations",
      "Custom workflows"
    ],
  },
] as const;

const PricingSection = forwardRef<HTMLElement>(function PricingSection(props, ref) {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCredits, setSelectedCredits] = useState(8000);
  const [currency, setCurrency] = useState(currencies[0]);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  // Calculate which bar index is selected
  const selectedBarIndex = Math.round(((selectedCredits - MIN_CREDITS) / (MAX_CREDITS - MIN_CREDITS)) * (NUM_BARS - 1));
  const badgePosition = (selectedBarIndex / (NUM_BARS - 1)) * 100;

  const formattedCreditCount = selectedCredits.toLocaleString();

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const percent = parseFloat(event.target.value);
    if (Number.isNaN(percent)) {
      return;
    }
    // Convert slider percent to credit value
    const credits = Math.round(MIN_CREDITS + (percent / 100) * (MAX_CREDITS - MIN_CREDITS));
    setSelectedCredits(credits);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return `${currency.symbol}0`;
    return `${currency.symbol}${price}`;
  };

  const getRecommendedPlan = () => {
    return selectedCredits <= 1000 ? "Free" : "Pro";
  };

  return (
    <section ref={ref} id="pricing" className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-12 text-center">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
            }}
          >
            Pricing
          </h2>
        </div>

        {/* Interactive Controls */}
        <div className="mb-12 rounded-[28px] border border-[#dcd2c1] bg-[#fbf8f1] px-5 py-4 shadow-[0_14px_40px_rgba(36,28,23,0.08)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-[14px] font-futura font-semibold text-[#211a14]">
              <span>I need</span>
              <span className="inline-flex rounded-full bg-waygent-blue px-2.5 py-[5px] text-[12px] font-bold tracking-wide text-white">
                {formattedCreditCount}
              </span>
              <span>credits per month</span>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 text-[12px] font-futura font-semibold text-[#2d2a24] transition-colors duration-150 hover:text-black"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
                <path d="M8 2.5v4" />
                <path d="M16 2.5v4" />
                <path d="M3.5 10.5h17" />
              </svg>
              <span>Learn about credits</span>
            </button>
          </div>

          {/* Bar Chart Slider */}
          <div className="relative mt-4 mx-auto max-w-md">
            {/* Floating Value Badge */}
            <div
              className="absolute -top-7 transform -translate-x-1/2 z-20"
              style={{
                left: `${badgePosition}%`,
              }}
            >
              <span className="inline-flex rounded-full border-2 border-waygent-blue bg-white px-3 py-1.5 text-xs font-semibold text-waygent-blue shadow-sm">
                {formattedCreditCount}
              </span>
            </div>

            {/* Bars Container */}
            <div className="relative flex items-end justify-between gap-[2px] h-[18px]">
              {Array.from({ length: NUM_BARS }).map((_, index) => {
                const isSelected = index <= selectedBarIndex;
                const height = isSelected ? ELEVATED_BAR_HEIGHT : BASE_BAR_HEIGHT;
                const color = isSelected ? "#3b82f6" : "#e5e7eb";

                return (
                  <div
                    key={`bar-${index}`}
                    className="flex-1 rounded-t-[1px]"
                    style={{
                      height: `${height}px`,
                      backgroundColor: color,
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                );
              })}
            </div>

            {/* Tick marks below bars */}
            <div className="relative h-2 mt-0.5">
              {Array.from({ length: 11 }).map((_, i) => (
                <span
                  key={`tick-${i}`}
                  className="absolute w-px h-1.5 bg-gray-300"
                  style={{
                    left: `${(i / 10) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              ))}
            </div>

            {/* Hidden range input for interaction */}
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={((selectedCredits - MIN_CREDITS) / (MAX_CREDITS - MIN_CREDITS)) * 100}
              onChange={handleSliderChange}
              aria-label="Credits per month"
              className="absolute top-0 left-0 right-0 w-full h-full cursor-pointer appearance-none bg-transparent opacity-0 z-30"
              style={{
                WebkitAppearance: "none",
              }}
            />
          </div>

          {/* Range Labels */}
          <div className="relative mt-2 flex justify-between mx-auto max-w-md text-[10px] font-futura text-gray-400">
            <span>{MIN_CREDITS.toLocaleString()} credits</span>
            <span>{MAX_CREDITS.toLocaleString()} credits</span>
          </div>

          {/* Billing and Currency Controls */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {/* Billing Period Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-700 font-futura">Billing:</span>
              <div className="relative inline-flex items-center bg-gray-100 rounded-full p-0.5 shadow-inner">
                <button
                  type="button"
                  onClick={() => setIsAnnual(false)}
                  className={`relative z-10 px-3 py-1 text-[11px] font-bold font-futura rounded-full transition-all duration-300 ${
                    !isAnnual
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setIsAnnual(true)}
                  className={`relative z-10 px-3 py-1 text-[11px] font-bold font-futura rounded-full transition-all duration-300 ${
                    isAnnual
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Annual
                </button>
                {/* Sliding background */}
                <div
                  className="absolute top-0.5 bottom-0.5 bg-waygent-blue rounded-full shadow-sm transition-all duration-300 ease-out"
                  style={{
                    left: isAnnual ? '50%' : '2px',
                    right: isAnnual ? '2px' : '50%',
                  }}
                />
              </div>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-gray-700 font-futura">Currency:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold font-futura text-gray-900 bg-white border border-gray-200 rounded-full hover:border-gray-300 shadow-sm"
                >
                  {currency.symbol} {currency.code}
                  <svg
                    className="w-3 h-3 text-gray-500"
                    style={{
                      transform: isCurrencyOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCurrencyOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsCurrencyOpen(false)}
                    />
                    <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-[110px]">
                      {currencies.map((curr) => (
                        <div
                          key={curr.code}
                          onClick={() => {
                            setCurrency(curr);
                            setIsCurrencyOpen(false);
                          }}
                          className="px-3 py-2 text-[11px] font-bold font-futura cursor-pointer first:rounded-t-lg last:rounded-b-lg"
                          style={{
                            backgroundColor: currency.code === curr.code ? '#3b82f6' : 'transparent',
                            color: '#1f2937',
                          }}
                          onMouseEnter={(e) => {
                            if (currency.code !== curr.code) {
                              e.currentTarget.style.backgroundColor = '#f3f4f6';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (currency.code !== curr.code) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          {curr.symbol} {curr.code}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 max-w-3xl mx-auto">
          {pricingTiers.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            const isFree = price === 0;
            const isRecommended = getRecommendedPlan() === tier.plan;
            // Free tier is always available
            const isAvailable = tier.plan === "Free" ? true : selectedCredits <= tier.maxCredits;

            return (
              <article
                key={tier.plan}
                className={`flex flex-col overflow-hidden rounded-[20px] border border-waygent-light-blue/40 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                  !isAvailable ? 'opacity-50' : ''
                }`}
              >
                <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-[#EBE5D9] to-[#f5f2e9]">
                  <Image
                    src="/illustrations/starter-pricing.jpg"
                    alt={tier.plan}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover"
                  />
                  {isRecommended && isAvailable && (
                    <div className="absolute top-3 left-3 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md font-futura">
                      Recommended
                    </div>
                  )}
                  {isAnnual && !isFree && (
                    <div className="absolute top-3 right-3 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md font-futura">
                      Save 25%
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col border-t border-waygent-light-blue/30 px-4 py-3">
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-gray-900 font-futura mb-0.5">
                      {tier.plan}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-0.5">
                      <span className="text-[1.5rem] font-bold text-gray-900 leading-none font-futura">
                        {formatPrice(price)}
                      </span>
                      {!isFree && (
                        <span className="text-[9px] text-gray-600 font-futura">/month</span>
                      )}
                    </div>
                    <p className="text-[9px] text-gray-500 font-futura">
                      Up to {tier.maxCredits.toLocaleString()} credits per month
                    </p>
                  </div>

                  <Link
                    href="/signup"
                    className={`w-full rounded-full px-5 py-2.5 text-center text-sm font-bold transition font-futura mb-3 border-2 ${
                      isAvailable
                        ? 'bg-white border-gray-900 text-gray-900 hover:bg-gray-50 hover:border-black shadow-md hover:shadow-lg'
                        : 'bg-white border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {!isAvailable ? 'Not available' : (tier.plan === "Free" ? "Get started" : "Start trial")}
                  </Link>

                  <ul className="space-y-1.5">
                    {tier.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-start gap-1.5">
                        <svg className="w-3 h-3 text-gray-700 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[10px] text-gray-700 leading-relaxed font-futura">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
          </div>
        </div>
      </div>
    </section>
  );
});

export default PricingSection;
