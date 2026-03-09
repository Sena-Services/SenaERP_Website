"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

const steps = [
  {
    number: "1",
    title: "Talk",
    description: "Discovery Agent asks questions. It listens and captures notes live.",
  },
  {
    number: "2",
    title: "Notes",
    description: "Conversation becomes structured notes as you go.",
  },
  {
    number: "3",
    title: "BRD",
    description: "Notes become a formal Business Requirements Document.",
  },
  {
    number: "4",
    title: "Contract",
    description: "BRD becomes a contract with specific deliverables: agents, tools, skills, UIs, logic.",
  },
  {
    number: "5",
    title: "Review & Edit",
    description: "Support Agent explains anything or makes edits. Adjust scope, ask questions.",
  },
  {
    number: "6",
    title: "Approval",
    description: "Submit for approval. A manager reviews and greenlights.",
  },
  {
    number: "7",
    title: "Build",
    description: "Builder Agent executes the contract. Watch real-time progress.",
  },
  {
    number: "8",
    title: "Test",
    description: "Automated and manual testing. Verify everything works as expected.",
  },
  {
    number: "9",
    title: "Payment",
    description: "Pay only for what was delivered. Transparent cost breakdown.",
  },
];

const row1 = steps.slice(0, 5);
const row2 = steps.slice(5);

function StepCard({ step }: { step: typeof steps[0] }) {
  return (
    <div
      className="rounded-xl relative"
      style={{
        backgroundColor: "#FCFCFA",
        border: "2px solid #9CA3AF",
        padding: "14px",
        height: "100%",
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="flex-shrink-0 flex items-center justify-center rounded-full"
          style={{
            width: "24px",
            height: "24px",
            backgroundColor: "#F5F1E8",
            border: "2px solid #9CA3AF",
            fontFamily: "Georgia, serif",
            fontSize: "12px",
            color: "#2C1810",
            fontWeight: 500,
          }}
        >
          {step.number}
        </span>
        <h3
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "14px",
            fontWeight: 600,
            color: "#2C1810",
          }}
        >
          {step.title}
        </h3>
      </div>
      <p
        className="font-futura text-gray-500 leading-snug"
        style={{ fontSize: "12px" }}
      >
        {step.description}
      </p>
    </div>
  );
}

function Arrow({ flip }: { flip?: boolean }) {
  return (
    <div className="flex items-center justify-center" style={{ width: "16px", flexShrink: 0 }}>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function DownArrow() {
  return (
    <div className="flex justify-end" style={{ paddingRight: "calc(10% - 8px)" }}>
      <svg
        width="14"
        height="18"
        viewBox="0 0 16 20"
        fill="none"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v16M2 13l6 6 6-6" />
      </svg>
    </div>
  );
}

export default function ContractsSection() {
  const isMobile = useIsMobile();

  return (
    <div id="contracts" className="scroll-mt-24">
      <div
        className="mx-auto"
        style={{
          maxWidth: isMobile ? "100%" : "min(1280px, calc(100vw - 320px))",
          paddingLeft: isMobile ? "20px" : "max(16px, min(32px, 2vw))",
          paddingRight: isMobile ? "20px" : "max(16px, min(32px, 2vw))",
          paddingTop: isMobile ? "16px" : "0",
          paddingBottom: isMobile ? "48px" : "64px",
        }}
      >
        {/* Section Header */}
        <div className="text-center mt-4 mb-4 px-4">
          <h2
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#2C1810",
              fontSize: isMobile ? "32px" : "40px",
            }}
          >
            Contracts
          </h2>
          <p className="text-gray-700 mx-auto max-w-3xl leading-relaxed text-base font-futura">
            From conversation to a fully built system.
          </p>
          <p
            className="text-gray-500 mx-auto max-w-2xl leading-relaxed font-futura mt-2"
            style={{ fontSize: "15px" }}
          >
            Tell us what you need. Our Discovery Agent talks to you — no jargon, no forms, just a
            conversation. It asks the right questions, takes notes as you go, and turns your answers
            into a structured plan. When you&apos;re happy with it, one click kicks off the build.
            That&apos;s a contract.
          </p>
        </div>

        {/* White container matching BuilderTabbed */}
        <div
          className="bg-white rounded-[2rem] overflow-hidden relative"
          style={{
            border: "2px solid #9CA3AF",
            boxShadow: "0 12px 40px -8px rgba(139, 119, 89, 0.12), 0 4px 16px -4px rgba(139, 119, 89, 0.08)",
            zIndex: 10,
            padding: isMobile ? "20px" : "28px 32px",
          }}
        >
          {/* Timeline Grid */}
          {isMobile ? (
            <div className="flex flex-col gap-3">
              {steps.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          ) : (
            <div>
              {/* Row 1: Steps 1-5 left to right */}
              <div className="flex items-stretch gap-0">
                {row1.map((step, i) => (
                  <div key={step.number} className="flex items-stretch" style={{ flex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <StepCard step={step} />
                    </div>
                    {i < row1.length - 1 && <Arrow />}
                  </div>
                ))}
              </div>

              {/* Connecting arrow down from step 5 to row 2 */}
              <DownArrow />

              {/* Row 2: Steps 9-6 right-to-left (6 is under step 5) */}
              <div className="flex items-stretch gap-0" style={{ justifyContent: "flex-end" }}>
                {[...row2].reverse().map((step, i) => (
                  <div key={step.number} className="flex items-stretch" style={{ flex: 1 }}>
                    <div style={{ flex: 1 }}>
                      <StepCard step={step} />
                    </div>
                    {i < row2.length - 1 && <Arrow flip />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* How contracts are resolved + Asset Ownership */}
          <div
            className={isMobile ? "flex flex-col gap-4 mt-6" : "flex gap-4 mt-6"}
          >
            {/* How are contracts resolved? */}
            <div
              className="rounded-xl flex-1"
              style={{
                backgroundColor: "#FCFCFA",
                border: "2px solid #9CA3AF",
                padding: isMobile ? "16px" : "20px",
              }}
            >
              <p
                className="font-futura mb-3"
                style={{ fontSize: "13px", color: "#8A7A68", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                How are contracts resolved?
              </p>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2">
                  <span className="font-futura text-gray-400 flex-shrink-0" style={{ fontSize: "12px", marginTop: "1px" }}>1.</span>
                  <p className="font-futura text-gray-600 leading-relaxed" style={{ fontSize: "13px" }}>
                    <span style={{ color: "#5A4938", fontWeight: 600 }}>Registry match</span> — We check the Registry first. If something already exists that fits, we point it to you with light customizations. AI handles most of the wiring.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-futura text-gray-400 flex-shrink-0" style={{ fontSize: "12px", marginTop: "1px" }}>2.</span>
                  <p className="font-futura text-gray-600 leading-relaxed" style={{ fontSize: "13px" }}>
                    <span style={{ color: "#5A4938", fontWeight: 600 }}>Custom build</span> — If the requirement goes beyond what&apos;s in the Registry, we build it. A community of developers picks up these contracts, powered by the Sena SDK — AI and human working together.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-futura text-gray-400 flex-shrink-0" style={{ fontSize: "12px", marginTop: "1px" }}>3.</span>
                  <p className="font-futura text-gray-600 leading-relaxed" style={{ fontSize: "13px" }}>
                    <span style={{ color: "#5A4938", fontWeight: 600 }}>Delivery</span> — Either way, you get composable building blocks: agents, tools, skills, UIs, logic, and teams. All yours to keep.
                  </p>
                </div>
              </div>
            </div>

            {/* Asset Ownership */}
            <div
              className="rounded-xl flex-1"
              style={{
                backgroundColor: "#FCFCFA",
                border: "2px solid #9CA3AF",
                padding: isMobile ? "16px" : "20px",
              }}
            >
              <p
                className="font-futura mb-3"
                style={{ fontSize: "13px", color: "#8A7A68", letterSpacing: "0.04em", textTransform: "uppercase" }}
              >
                Asset Ownership
              </p>
              <div className="space-y-2.5">
                <p className="font-futura text-gray-600 leading-relaxed" style={{ fontSize: "13px" }}>
                  What gets built through a contract is yours. Full access to your agents, data, and the logic behind them.
                </p>
                <p className="font-futura text-gray-600 leading-relaxed" style={{ fontSize: "13px" }}>
                  <span style={{ color: "#5A4938", fontWeight: 600 }}>Build and earn.</span> Publish your components to the Registry and get a revenue share every time someone uses your work.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Your Data", "Your Agents", "Your Access"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full font-futura"
                      style={{
                        backgroundColor: "#F5F1E8",
                        border: "2px solid #9CA3AF",
                        color: "#5A4938",
                        fontSize: "12px",
                        padding: "4px 12px",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
