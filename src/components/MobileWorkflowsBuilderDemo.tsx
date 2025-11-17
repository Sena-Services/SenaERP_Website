"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MobileWorkflowsBuilderDemoProps = {
  isVisible?: boolean;
};

export default function MobileWorkflowsBuilderDemo({ isVisible = true }: MobileWorkflowsBuilderDemoProps) {
  const [currentExample, setCurrentExample] = useState(0);
  const [phase, setPhase] = useState<"chat" | "preview">("chat");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [visibleSteps, setVisibleSteps] = useState(0);

  const examples = [
    {
      userMessage: "When a new lead submits the form, send notification to Slack and create task",
      buildingSteps: [
        "Creating trigger...",
        "Setting up Slack...",
        "Configuring task..."
      ],
      aiResponse: "Perfect! Your workflow is ready. When a new lead submits the form, it will automatically send a notification to your #sales Slack channel with all the lead details, and create a high-priority task assigned to your sales team. The entire process runs automatically in the background with no manual intervention needed.",
      steps: [
        { icon: "⚡", title: "TRIGGER", subtitle: "New Lead Created" },
        { icon: "💬", title: "SLACK", subtitle: "#sales channel" },
        { icon: "✓", title: "TASK", subtitle: "Assign to Sales" }
      ]
    },
    {
      userMessage: "When order total exceeds $1000, require manager approval before processing",
      buildingSteps: [
        "Creating trigger...",
        "Adding condition...",
        "Setting up approval..."
      ],
      aiResponse: "Done! Your approval workflow is active. Orders over $1000 will automatically pause and send an approval request email to the manager with full order details. The order status will show 'Pending Approval' until the manager responds. Once approved, processing continues automatically.",
      steps: [
        { icon: "⚡", title: "TRIGGER", subtitle: "Order Created/Updated" },
        { icon: "🔀", title: "CONDITION", subtitle: "Total > $1000" },
        { icon: "📧", title: "APPROVAL", subtitle: "Manager Review" }
      ]
    },
    {
      userMessage: "When inventory drops below 10 units, automatically reorder from supplier",
      buildingSteps: [
        "Creating trigger...",
        "Adding condition...",
        "Setting up reorder..."
      ],
      aiResponse: "All set! Your inventory workflow is monitoring stock levels. When any item drops below 10 units, it will automatically calculate the optimal reorder quantity based on your sales history, create a purchase order in your supplier's system, and notify your procurement team. No more manual inventory checks!",
      steps: [
        { icon: "⚡", title: "TRIGGER", subtitle: "Inventory Updated" },
        { icon: "🔀", title: "CONDITION", subtitle: "Quantity < 10" },
        { icon: "🛒", title: "PURCHASE", subtitle: "Auto Reorder" }
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
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      // Full reset
      setPhase("chat");
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowCursor(true);
      setVisibleSteps(0);

      // 1. Show user message
      timeouts.push(setTimeout(() => setShowUserMessage(true), 500));

      // 2. Progress through building stages
      let currentStage = 0;
      const progressStages = () => {
        if (currentStage < currentExampleData.buildingSteps.length) {
          timeouts.push(setTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, 600));
        } else {
          // 3. Show AI response
          timeouts.push(setTimeout(() => {
            setShowFinalResponse(true);
            // 4. After response, switch to preview
            timeouts.push(setTimeout(() => {
              setPhase("preview");
              // Show steps one by one in preview
              let step = 0;
              const showSteps = () => {
                if (step < currentExampleData.steps.length) {
                  timeouts.push(setTimeout(() => {
                    step++;
                    setVisibleSteps(step);
                    showSteps();
                  }, 400));
                }
              };
              showSteps();

              // 5. Show preview for a bit, then reset and move to next
              timeouts.push(setTimeout(() => {
                setPhase("chat");
                setShowUserMessage(false);
                setBuildingStage(0);
                setShowFinalResponse(false);
                setAiResponseText("");
                setShowCursor(true);
                setVisibleSteps(0);

                timeouts.push(setTimeout(() => {
                  setCurrentExample((prev) => (prev + 1) % examples.length);
                }, 300));
              }, 3500));
            }, 2500));
          }, 200));
        }
      };

      timeouts.push(setTimeout(() => progressStages(), 600));
    };

    runSequence();

    // Cleanup function - cancel all timeouts when component unmounts or isVisible changes
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible, currentExample]);

  // Typing animation for AI response
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
      }, 20);

      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
      };
    }
  }, [showFinalResponse, phase, currentExampleData.aiResponse]);

  return (
    <div className="w-full">
      <div
        className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl overflow-hidden border border-gray-200"
        style={{ height: '420px' }}
      >
        <AnimatePresence mode="wait">
          {phase === "chat" ? (
            // CHAT PHASE
            <motion.div
              key="chat"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col bg-white"
            >
              {/* Chat Header */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Workflow Builder</h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 space-y-2.5" style={{ maxHeight: '320px' }}>
                {/* User Message */}
                <AnimatePresence mode="wait">
                  {showUserMessage && (
                    <motion.div
                      key={`user-${currentExample}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-end"
                    >
                      <div className="bg-blue-500 text-white px-3 py-2 rounded-2xl rounded-tr-sm max-w-[90%] text-xs leading-relaxed">
                        {currentExampleData.userMessage}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Building Steps */}
                {buildingStage > 0 && (
                  <div className="space-y-1.5">
                    {currentExampleData.buildingSteps.slice(0, buildingStage).map((step, index) => (
                      <motion.div
                        key={`${currentExample}-${index}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-xs text-gray-600"
                      >
                        {index === buildingStage - 1 && buildingStage < currentExampleData.buildingSteps.length ? (
                          <>
                            <div className="flex gap-0.5">
                              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-blue-600 text-xs">{step}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-500 text-xs">{step}</span>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* AI Final Response */}
                {showFinalResponse && (
                  <motion.div
                    key={`ai-${currentExample}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-xs text-gray-700 leading-relaxed mt-2"
                  >
                    {aiResponseText}
                    {showCursor && <span className="inline-block w-0.5 h-3.5 bg-blue-500 ml-0.5 animate-pulse" />}
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 bg-white p-2.5">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                  <input
                    type="text"
                    placeholder="Describe your workflow..."
                    className="flex-1 bg-transparent text-xs outline-none text-gray-400"
                    disabled
                  />
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ) : (
            // PREVIEW PHASE - Workflow nodes
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="h-full bg-white rounded-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gray-100 px-2.5 py-2 border-b border-gray-200 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 font-mono ml-1">Workflow Preview</span>
              </div>

              {/* Workflow Steps */}
              <div className="p-4" style={{ height: 'calc(420px - 38px)', overflow: 'hidden' }}>
                <div className="relative h-full flex items-center">
                  {/* Connecting line - positioned absolutely to connect dots */}
                  {visibleSteps > 1 && (
                    <motion.div
                      className="absolute w-px bg-purple-300 z-0"
                      style={{
                        left: '7px', // Half of dot width (16px / 2 - 1px line / 2)
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(visibleSteps - 1) * 80}px` }}
                      transition={{ duration: 0.4 }}
                    />
                  )}

                  {/* Steps */}
                  <div className="space-y-4 relative z-10 w-full">
                    {currentExampleData.steps.slice(0, visibleSteps).map((step, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-start gap-3"
                      >
                        {/* Connection dot - positioned to align with card center */}
                        <div
                          className="w-4 h-4 rounded-full bg-purple-500 border-2 border-white shadow-sm flex-shrink-0 mt-3"
                        />

                        {/* Step card */}
                        <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{step.icon}</span>
                            <div>
                              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide">{step.title}</h4>
                              <p className="text-xs text-gray-600">{step.subtitle}</p>
                            </div>
                          </div>
                        </div>
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
