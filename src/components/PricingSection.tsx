"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import Image from "next/image";

const sliderStops = [
  { value: 100, label: "100" },
  { value: 2000, label: "2K" },
  { value: 10000, label: "10K" },
  { value: 100000, label: "100K" },
  { value: 1000000, label: "1M" },
  { value: 2000000, label: "2M" },
] as const;

const MIN_TASKS = sliderStops[0].value;
const MAX_TASKS = sliderStops[sliderStops.length - 1].value;
const LOG_MIN = Math.log10(MIN_TASKS);
const LOG_MAX = Math.log10(MAX_TASKS);
const LOG_RANGE = LOG_MAX - LOG_MIN;

type TickKind = "major" | "medium" | "minor";

type SliderTick = {
  value: number;
  percent: number;
  kind: TickKind;
};

const sliderStopsWithPercent = sliderStops.map((stop) => ({
  ...stop,
  percent: valueToPercent(stop.value),
}));

const sliderTicks = generateSliderTicks();

const TICK_HEIGHTS: Record<TickKind, number> = {
  major: 14,
  medium: 10,
  minor: 8,
};

const TRACK_TOP = 14;
const TRACK_HEIGHT = 3;

function valueToPercent(value: number): number {
  const clamped = Math.min(Math.max(value, MIN_TASKS), MAX_TASKS);
  const logValue = Math.log10(clamped);
  return ((logValue - LOG_MIN) / LOG_RANGE) * 100;
}

function percentToValue(percent: number): number {
  const normalized = Math.min(Math.max(percent, 0), 100) / 100;
  const logValue = LOG_MIN + normalized * LOG_RANGE;
  const rawValue = Math.pow(10, logValue);
  return snapTaskValue(rawValue);
}

function snapTaskValue(value: number): number {
  let snapped: number;

  if (value <= 1000) {
    snapped = Math.round(value / 50) * 50;
  } else if (value <= 10000) {
    snapped = Math.round(value / 100) * 100;
  } else if (value <= 100000) {
    snapped = Math.round(value / 500) * 500;
  } else if (value <= 1000000) {
    snapped = Math.round(value / 1000) * 1000;
  } else {
    snapped = Math.round(value / 25000) * 25000;
  }

  return clampTasks(snapped);
}

function clampTasks(value: number): number {
  return Math.min(Math.max(Math.round(value), MIN_TASKS), MAX_TASKS);
}

function generateSliderTicks(): SliderTick[] {
  const tickMultipliers = [1, 2, 5] as const;
  const majorValues = new Set(sliderStops.map((stop) => stop.value));
  const seen = new Set<number>();
  const ticks: SliderTick[] = [];

  for (let exponent = Math.floor(LOG_MIN); exponent <= Math.ceil(LOG_MAX); exponent += 1) {
    for (const base of tickMultipliers) {
      const value = base * Math.pow(10, exponent);
      if (value < MIN_TASKS || value > MAX_TASKS || seen.has(value)) {
        continue;
      }

      seen.add(value);

      const kind: TickKind = majorValues.has(value)
        ? "major"
        : base === 5
          ? "medium"
          : "minor";

      ticks.push({
        value,
        percent: valueToPercent(value),
        kind,
      });
    }
  }

  return ticks.sort((a, b) => a.value - b.value);
}

const currencies = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
];

const pricingTiers = [
  {
    plan: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    tagline: "Perfect for trying Sena",
    maxTasks: 1000,
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
    maxTasks: 100000,
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

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState(1500);
  const [currency, setCurrency] = useState(currencies[0]);

  const sliderPercent = valueToPercent(selectedTasks);
  const formattedTaskCount = selectedTasks.toLocaleString();

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPercent = parseFloat(event.target.value);
    if (Number.isNaN(nextPercent)) {
      return;
    }
    setSelectedTasks(percentToValue(nextPercent));
  };

  const formatPrice = (price: number) => {
    if (price === 0) return `${currency.symbol}0`;
    return `${currency.symbol}${price}`;
  };

  const getRecommendedPlan = () => {
    return selectedTasks <= 1000 ? "Free" : "Pro";
  };

  return (
    <section id="pricing" className="scroll-mt-32 mt-16 sm:mt-16 px-4 sm:px-6 lg:px-8">
      <div className="relative mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-4xl font-semibold text-waygent-text-primary sm:text-[2.75rem] sm:leading-tight font-futura">
            Pricing
          </h2>
        </div>

        {/* Interactive Controls */}
        <div className="mb-12 rounded-[28px] border border-[#dcd2c1] bg-[#fbf8f1] px-6 py-6 shadow-[0_14px_40px_rgba(36,28,23,0.08)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2 text-[15px] font-futura font-semibold text-[#211a14]">
              <span>I need</span>
              <span className="inline-flex rounded-full bg-[#f45a0d] px-3 py-[6px] text-[13px] font-bold tracking-wide text-white">
                {formattedTaskCount}
              </span>
              <span>tasks per month</span>
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
              <span>Learn about tasks</span>
            </button>
          </div>

          <div className="relative mt-3 h-12 px-1.5">
            <div
              className="absolute left-0 right-0 z-0"
              style={{
                top: `${TRACK_TOP}px`,
                height: `${TRACK_HEIGHT}px`,
                backgroundColor: "#d8d0c1",
              }}
            />
            <div
              className="absolute left-0 z-10 transition-all duration-300 ease-out"
              style={{
                top: `${TRACK_TOP}px`,
                height: `${TRACK_HEIGHT}px`,
                width: `${sliderPercent}%`,
                backgroundColor: "#1f1714",
              }}
            />
            {sliderTicks.map((tick) => {
              const height = TICK_HEIGHTS[tick.kind];
              const color =
                tick.kind === "major"
                  ? "#241c17"
                  : tick.kind === "medium"
                    ? "#807563"
                    : "#b8af9d";

              return (
                <span
                  key={`tick-${tick.value}`}
                  className="absolute w-px"
                  style={{
                    left: `${tick.percent}%`,
                    top: `${TRACK_TOP - height}px`,
                    height: `${height}px`,
                    transform: "translateX(-50%)",
                    backgroundColor: color,
                    zIndex: 20,
                  }}
                />
              );
            })}
            <div
              className="absolute z-30 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#0f0c0a] transition-transform duration-300"
              style={{
                top: `${TRACK_TOP + TRACK_HEIGHT / 2}px`,
                left: `${sliderPercent}%`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 3px #2a4efe, 0 2px 7px rgba(0,0,0,0.4)",
              }}
            >
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={sliderPercent}
              onChange={handleSliderChange}
              aria-label="Tasks per month"
              className="pricing-slider absolute left-0 right-0 cursor-pointer appearance-none bg-transparent"
              style={{
                top: `${TRACK_TOP - 18}px`,
                height: "48px",
                WebkitAppearance: "none",
                appearance: "none",
                background: "transparent",
                zIndex: 40,
              }}
            />
          </div>

          <div className="relative mt-0 h-4 px-2 text-[11px] font-futura text-[#433c2f]">
            {sliderStopsWithPercent.map((stop) => {
              const translate =
                stop.value === MIN_TASKS ? "translateX(0)" : stop.value === MAX_TASKS ? "translateX(-100%)" : "translateX(-50%)";

              return (
                <button
                  key={stop.value}
                  type="button"
                  onClick={() => setSelectedTasks(stop.value)}
                  className={`absolute whitespace-nowrap transition-colors duration-200 ${
                    selectedTasks === stop.value ? "font-semibold text-black" : "text-[#6f6657] hover:text-black"
                  }`}
                  style={{
                    left: `${stop.percent}%`,
                    transform: translate,
                  }}
                >
                  {stop.label}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1 rounded-full border border-[#d3c5b1] bg-white p-1 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-3 py-1 text-[11px] font-futura font-semibold transition-all ${
                  !isAnnual
                    ? "rounded-full bg-[#f45a0d] text-white shadow-[0_6px_14px_rgba(244,90,13,0.3)]"
                    : "rounded-full text-[#3f362a] hover:bg-[#f5ede1] hover:text-[#21190f]"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`px-3 py-1 text-[11px] font-futura font-semibold transition-all ${
                  isAnnual
                    ? "rounded-full bg-[#f45a0d] text-white shadow-[0_6px_14px_rgba(244,90,13,0.3)]"
                    : "rounded-full text-[#3f362a] hover:bg-[#f5ede1] hover:text-[#21190f]"
                }`}
              >
                Annual
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-futura font-semibold text-[#6a6254]">
              <span>Currency</span>
              <div className="relative">
                <select
                  value={currency.code}
                  onChange={(event) =>
                    setCurrency(currencies.find((curr) => curr.code === event.target.value) || currencies[0])
                  }
                  className="appearance-none rounded-full border border-[#d8d0c1] bg-white/80 px-3 pr-8 py-1 text-[#1f1b15] shadow-sm transition-all duration-150 hover:bg-white hover:shadow focus:outline-none focus:ring-2 focus:ring-[#f45a0d]/40"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.code} ({curr.symbol})
                    </option>
                  ))}
                </select>
                <svg
                  className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-[#f45a0d]"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 7.5 10 12.5 15 7.5" />
                </svg>
              </div>
            </div>
          </div>

          <style jsx>{`
            .pricing-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              height: 0;
              width: 0;
              border: none;
            }

            .pricing-slider::-moz-range-thumb {
              appearance: none;
              height: 0;
              width: 0;
              border: none;
              background: transparent;
            }

            .pricing-slider::-ms-thumb {
              appearance: none;
              height: 0;
              width: 0;
              border: none;
              background: transparent;
            }

            .pricing-slider::-webkit-slider-runnable-track {
              background: transparent;
            }

            .pricing-slider::-moz-range-track {
              background: transparent;
            }

            .pricing-slider::-ms-track {
              background: transparent;
              border-color: transparent;
              color: transparent;
            }
          `}</style>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
          {pricingTiers.map((tier) => {
            const price = isAnnual ? tier.annualPrice : tier.monthlyPrice;
            const isFree = price === 0;
            const isRecommended = getRecommendedPlan() === tier.plan;
            const isAvailable = selectedTasks <= tier.maxTasks;

            return (
              <article
                key={tier.plan}
                className={`flex flex-col overflow-hidden rounded-[28px] border border-waygent-light-blue/40 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  !isAvailable ? 'opacity-50' : ''
                }`}
              >
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#EBE5D9] to-[#f5f2e9]">
                  <Image
                    src="/illustrations/starter-pricing.jpg"
                    alt={tier.plan}
                    fill
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

                <div className="flex flex-1 flex-col border-t border-waygent-light-blue/30 px-5 py-4">
                  <div className="mb-3">
                    <h3 className="text-base font-bold text-gray-900 font-futura mb-1">
                      {tier.plan}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-[2rem] font-bold text-gray-900 leading-none font-futura">
                        {formatPrice(price)}
                      </span>
                      {!isFree && (
                        <span className="text-[10px] text-gray-600 font-futura">/month</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 font-futura">
                      Up to {tier.maxTasks.toLocaleString()} tasks per month
                    </p>
                  </div>

                  <Link
                    href="/signup"
                    className={`w-full rounded-full px-6 py-3.5 text-center text-base font-bold transition font-futura mb-4 border-2 ${
                      isAvailable
                        ? 'bg-black border-black text-white hover:bg-gray-900 hover:border-gray-900 shadow-lg hover:shadow-xl'
                        : 'bg-white border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {!isAvailable ? 'Not available' : (tier.plan === "Free" ? "Get started" : "Start trial")}
                  </Link>

                  <ul className="space-y-2">
                    {tier.features.slice(0, 3).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <svg className="w-3.5 h-3.5 text-gray-700 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[11px] text-gray-700 leading-relaxed font-futura">
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
    </section>
  );
}
