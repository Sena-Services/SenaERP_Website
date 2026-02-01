"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MobileWorkflowsBuilderDemoProps = {
  isVisible?: boolean;
};

// Compact SVG Icons
const TriggerIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const SlackIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const TaskIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ConditionIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
  </svg>
);

const ApprovalIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PurchaseIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const CalculateIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

export default function MobileWorkflowsBuilderDemo({ isVisible = true }: MobileWorkflowsBuilderDemoProps) {
  const [currentExample, setCurrentExample] = useState(0);
  const [phase, setPhase] = useState<"chat" | "preview">("chat");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const examples = [
    {
      userMessage: "When a new lead submits the form, notify Slack and create task",
      buildingSteps: [
        "Creating trigger...",
        "Setting up Slack...",
        "Configuring task...",
        "Testing workflow..."
      ],
      aiResponse: "Workflow ready! New leads will trigger Slack notifications and auto-create tasks.",
      steps: [
        { icon: <TriggerIcon />, title: "TRIGGER", subtitle: "New Lead Created", config: "onCreate → Lead" },
        { icon: <SlackIcon />, title: "SLACK", subtitle: "#sales channel", config: "Message: New lead" },
        { icon: <TaskIcon />, title: "TASK", subtitle: "Assign to Sales", config: "Priority: High" }
      ]
    },
    {
      userMessage: "When order exceeds $1000, require manager approval",
      buildingSteps: [
        "Creating trigger...",
        "Adding condition...",
        "Setting approval...",
        "Testing workflow..."
      ],
      aiResponse: "Approval workflow active. Orders over $1000 pause for manager review.",
      steps: [
        { icon: <TriggerIcon />, title: "TRIGGER", subtitle: "Order Created", config: "onCreate → Order" },
        { icon: <ConditionIcon />, title: "CONDITION", subtitle: "Total > $1000", config: "If true → continue" },
        { icon: <ApprovalIcon />, title: "APPROVAL", subtitle: "Manager Review", config: "Actions: Yes/No" }
      ]
    },
    {
      userMessage: "When inventory drops below 10, auto-reorder from supplier",
      buildingSteps: [
        "Creating trigger...",
        "Adding condition...",
        "Setting up reorder...",
        "Testing workflow..."
      ],
      aiResponse: "Inventory workflow active. Low stock triggers automatic purchase orders.",
      steps: [
        { icon: <TriggerIcon />, title: "TRIGGER", subtitle: "Inventory Update", config: "onUpdate → Stock" },
        { icon: <CalculateIcon />, title: "CALCULATE", subtitle: "Reorder Qty", config: "avg × lead_time × 2" },
        { icon: <PurchaseIcon />, title: "PURCHASE", subtitle: "Auto Reorder", config: "Notify: Procurement" }
      ]
    }
  ];

  const currentExampleData = examples[currentExample];

  useEffect(() => {
    if (!isVisible) {
      setPhase("chat");
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setVisibleSteps(0);
      setActiveStep(null);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      setPhase("chat");
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowCursor(true);
      setVisibleSteps(0);
      setActiveStep(null);

      timeouts.push(setTimeout(() => setShowUserMessage(true), 600));

      let currentStage = 0;
      const progressStages = () => {
        if (currentStage < currentExampleData.buildingSteps.length) {
          timeouts.push(setTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, 800));
        } else {
          timeouts.push(setTimeout(() => {
            setShowFinalResponse(true);
            timeouts.push(setTimeout(() => {
              setPhase("preview");

              // Show all steps quickly
              let step = 0;
              const showSteps = () => {
                if (step < currentExampleData.steps.length) {
                  timeouts.push(setTimeout(() => {
                    step++;
                    setVisibleSteps(step);
                    showSteps();
                  }, 400));
                } else {
                  // After all visible, cycle through highlighting each
                  timeouts.push(setTimeout(() => {
                    let highlight = 0;
                    const cycleHighlight = () => {
                      if (highlight < currentExampleData.steps.length) {
                        setActiveStep(highlight);
                        timeouts.push(setTimeout(() => {
                          highlight++;
                          cycleHighlight();
                        }, 1000));
                      }
                    };
                    cycleHighlight();
                  }, 500));
                }
              };
              showSteps();

              // Hold then cycle
              timeouts.push(setTimeout(() => {
                setPhase("chat");
                setShowUserMessage(false);
                setBuildingStage(0);
                setShowFinalResponse(false);
                setAiResponseText("");
                setShowCursor(true);
                setVisibleSteps(0);
                setActiveStep(null);

                timeouts.push(setTimeout(() => {
                  setCurrentExample((prev) => (prev + 1) % examples.length);
                }, 400));
              }, 6000));
            }, 2000));
          }, 300));
        }
      };

      timeouts.push(setTimeout(() => progressStages(), 800));
    };

    runSequence();

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible, currentExample]);

  useEffect(() => {
    if (showFinalResponse && phase === "chat") {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex >= currentExampleData.aiResponse.length) {
          clearInterval(typingInterval);
          setShowCursor(false);
          return;
        }
        currentIndex += 3;
        setAiResponseText(currentExampleData.aiResponse.slice(0, currentIndex));
      }, 25);

      return () => clearInterval(typingInterval);
    }
  }, [showFinalResponse, phase, currentExampleData.aiResponse]);

  return (
    <div className="w-full">
      <div
        className="bg-[#F5F1E8]/50 rounded-xl overflow-hidden border border-[#9CA3AF]"
        style={{ height: '280px' }}
      >
        <AnimatePresence mode="wait">
          {phase === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col bg-white"
            >
              {/* Chat Header */}
              <div className="px-3 py-2 bg-[#F5F1E8] border-b border-[#9CA3AF]/30">
                <h3 className="text-[11px] font-bold text-[#374151] uppercase tracking-wide">Workflow Builder</h3>
                <p className="text-[9px] text-gray-500">Automate any business process</p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 space-y-2 overflow-hidden">
                <AnimatePresence mode="wait">
                  {showUserMessage && (
                    <motion.div
                      key={`user-${currentExample}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-end"
                    >
                      <div className="bg-[#8FB7C5] text-white px-3 py-2 rounded-lg rounded-tr-sm max-w-[90%] text-[11px] leading-relaxed">
                        {currentExampleData.userMessage}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {buildingStage > 0 && (
                  <div className="space-y-1.5">
                    {currentExampleData.buildingSteps.slice(0, buildingStage).map((step, index) => (
                      <motion.div
                        key={`${currentExample}-${index}`}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-[10px] text-gray-600"
                      >
                        {index === buildingStage - 1 && buildingStage < currentExampleData.buildingSteps.length ? (
                          <>
                            <div className="flex gap-0.5">
                              <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-[#8FB7C5] font-medium">{step}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-[#8FB7C5] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-500">{step}</span>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {showFinalResponse && (
                  <motion.div
                    key={`ai-${currentExample}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-[11px] text-gray-700 leading-relaxed mt-2"
                  >
                    {aiResponseText}
                    {showCursor && <span className="inline-block w-0.5 h-3 bg-[#8FB7C5] ml-0.5 animate-pulse" />}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full bg-white overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#F5F1E8] px-3 py-2 border-b border-[#9CA3AF]/30 flex items-center gap-2 flex-shrink-0">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Workflow Preview</span>
                <div className="ml-auto px-1.5 py-0.5 bg-green-100 border border-green-300 rounded">
                  <span className="text-[8px] font-semibold text-green-700">ACTIVE</span>
                </div>
              </div>

              {/* Workflow - Horizontal Flow Diagram */}
              <div className="flex-1 p-3 flex flex-col overflow-hidden">
                {/* Flow diagram - horizontal with padding to prevent cutoff */}
                <div className="flex items-center justify-center gap-2 mb-3 px-2">
                  {currentExampleData.steps.slice(0, visibleSteps).map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center"
                    >
                      {/* Node */}
                      <motion.div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                          activeStep === idx
                            ? 'bg-[#8FB7C5] text-white shadow-md'
                            : 'bg-[#F5F1E8] text-[#8FB7C5] border-2 border-[#8FB7C5]/50'
                        }`}
                        animate={activeStep === idx ? { scale: [1, 1.15, 1] } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        {step.icon}
                      </motion.div>

                      {/* Arrow */}
                      {idx < visibleSteps - 1 && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 20 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className="flex items-center justify-center mx-1"
                        >
                          <svg className="w-5 h-2 text-[#8FB7C5]/60" fill="none" viewBox="0 0 20 8">
                            <path d="M0 4h16M13 1l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Step Cards with vertical connecting line */}
                <div className="flex-1 relative">
                  {/* Vertical connecting line */}
                  {visibleSteps > 1 && (
                    <motion.div
                      className="absolute left-[15px] top-[20px] w-0.5 bg-[#8FB7C5]/30 z-0"
                      initial={{ height: 0 }}
                      animate={{ height: `calc(100% - 40px)` }}
                      transition={{ duration: 0.5 }}
                    />
                  )}

                  {/* Cards */}
                  <div className="space-y-1.5 relative z-10">
                    {currentExampleData.steps.slice(0, visibleSteps).map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2"
                      >
                        {/* Timeline dot */}
                        <div className={`w-[30px] flex-shrink-0 flex justify-center`}>
                          <motion.div
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                              activeStep === idx
                                ? 'bg-[#8FB7C5] text-white'
                                : 'bg-white border-2 border-[#8FB7C5]/50 text-[#8FB7C5]'
                            }`}
                            animate={activeStep === idx ? { scale: [1, 1.2, 1] } : {}}
                          >
                            {step.icon}
                          </motion.div>
                        </div>

                        {/* Card */}
                        <motion.div
                          className={`flex-1 rounded-lg border transition-all duration-300 ${
                            activeStep === idx
                              ? 'border-[#8FB7C5] bg-[#F5F1E8] shadow-sm'
                              : 'border-[#9CA3AF]/30 bg-white'
                          }`}
                        >
                          <div className="px-2.5 py-1.5 flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold text-[#374151] uppercase tracking-wide">{step.title}</span>
                                <span className="text-[8px] text-gray-400">·</span>
                                <span className="text-[8px] text-gray-600 truncate">{step.subtitle}</span>
                              </div>
                              <div className="text-[7px] text-gray-500 font-mono">{step.config}</div>
                            </div>

                            {activeStep !== null && activeStep >= idx && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
                              >
                                <svg className="w-2 h-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
