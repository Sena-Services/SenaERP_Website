"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

type MobileAgentsBuilderDemoProps = {
  isVisible?: boolean;
};

export default function MobileAgentsBuilderDemo({ isVisible = true }: MobileAgentsBuilderDemoProps) {
  const [currentExample, setCurrentExample] = useState(0);
  const [phase, setPhase] = useState<"chat" | "preview">("chat");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [previewStage, setPreviewStage] = useState(0);

  const examples = [
    {
      userMessage: "Create a sales agent that handles product questions and pricing",
      buildingSteps: [
        "Configuring personality...",
        "Setting response style...",
        "Adding knowledge base...",
        "Testing responses...",
        "Agent ready!"
      ],
      aiResponse: "Sales agent ready! Friendly personality with access to product docs, FAQs, and pricing.",
      agentName: "Sales Assistant",
      config: {
        personality: "Professional & Friendly",
        responseLength: "Detailed",
        creativity: "Medium",
        style: "Step-by-step"
      },
      knowledge: ["Product Docs", "FAQs", "Pricing"],
      testQuestion: "What's your refund policy?"
    },
    {
      userMessage: "Build a support agent for technical troubleshooting",
      buildingSteps: [
        "Setting technical tone...",
        "Configuring format...",
        "Linking documentation...",
        "Testing flows...",
        "Agent configured!"
      ],
      aiResponse: "Support agent ready! Technical tone with step-by-step troubleshooting guides.",
      agentName: "Support Agent",
      config: {
        personality: "Technical & Patient",
        responseLength: "Detailed",
        creativity: "Low",
        style: "Step-by-step"
      },
      knowledge: ["Tech Docs", "Common Issues", "API Guides"],
      testQuestion: "How do I reset my password?"
    },
    {
      userMessage: "Create onboarding agent to guide new users",
      buildingSteps: [
        "Setting welcoming tone...",
        "Configuring flow...",
        "Adding materials...",
        "Testing interactions...",
        "Agent ready!"
      ],
      aiResponse: "Onboarding agent live! Welcoming tone with interactive tutorials and best practices.",
      agentName: "Onboarding Guide",
      config: {
        personality: "Welcoming & Supportive",
        responseLength: "Concise",
        creativity: "Medium",
        style: "Interactive"
      },
      knowledge: ["Onboarding Guide", "Training Videos", "Best Practices"],
      testQuestion: "How do I get started?"
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
      setPreviewStage(0);
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
      setPreviewStage(0);

      // Show user message
      timeouts.push(setTimeout(() => setShowUserMessage(true), 600));

      // Progress through building stages (slower)
      let currentStage = 0;
      const progressStages = () => {
        if (currentStage < currentExampleData.buildingSteps.length) {
          timeouts.push(setTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, 700)); // 700ms per step
        } else {
          // Show AI response
          timeouts.push(setTimeout(() => {
            setShowFinalResponse(true);
            // Switch to preview after response
            timeouts.push(setTimeout(() => {
              setPhase("preview");
              // Animate preview stages
              timeouts.push(setTimeout(() => setPreviewStage(1), 300)); // Header + configs
              timeouts.push(setTimeout(() => setPreviewStage(2), 1000)); // Knowledge
              timeouts.push(setTimeout(() => setPreviewStage(3), 1700)); // Test + Voice

              // Hold preview for 5 seconds then cycle
              timeouts.push(setTimeout(() => {
                setPhase("chat");
                setShowUserMessage(false);
                setBuildingStage(0);
                setShowFinalResponse(false);
                setAiResponseText("");
                setShowCursor(true);
                setPreviewStage(0);

                timeouts.push(setTimeout(() => {
                  setCurrentExample((prev) => (prev + 1) % examples.length);
                }, 400));
              }, 5000)); // 5 second hold
            }, 2000)); // 2 second hold on response
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
                <h3 className="text-[11px] font-bold text-[#374151] uppercase tracking-wide">Agent Builder</h3>
                <p className="text-[9px] text-gray-500">Configure intelligent AI assistants</p>
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
              className="h-full bg-white overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#F5F1E8] px-3 py-2 border-b border-[#9CA3AF]/30 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Agent Preview</span>
              </div>

              {/* Content */}
              <div className="p-2.5 space-y-2 overflow-y-auto" style={{ height: 'calc(280px - 42px)' }}>
                {/* Agent Header Card */}
                {previewStage >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-[#9CA3AF]/30 p-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#8FB7C5]/20 flex items-center justify-center">
                        <svg className="w-4 h-4 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[11px] font-bold text-gray-900 truncate">{currentExampleData.agentName}</h3>
                        <p className="text-[9px] text-gray-500">AI Agent</p>
                      </div>
                      <div className="px-1.5 py-0.5 bg-green-100 border border-green-300 rounded">
                        <span className="text-[8px] font-semibold text-green-700">LIVE</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Config Grid */}
                {previewStage >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="grid grid-cols-2 gap-1.5"
                  >
                    <div className="bg-[#F5F1E8]/50 border border-[#9CA3AF]/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[8px] font-semibold text-gray-500 uppercase">Personality</span>
                      </div>
                      <p className="text-[9px] text-gray-900">{currentExampleData.config.personality}</p>
                    </div>
                    <div className="bg-[#F5F1E8]/50 border border-[#9CA3AF]/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                        <span className="text-[8px] font-semibold text-gray-500 uppercase">Length</span>
                      </div>
                      <p className="text-[9px] text-gray-900">{currentExampleData.config.responseLength}</p>
                    </div>
                    <div className="bg-[#F5F1E8]/50 border border-[#9CA3AF]/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-[8px] font-semibold text-gray-500 uppercase">Creativity</span>
                      </div>
                      <p className="text-[9px] text-gray-900">{currentExampleData.config.creativity}</p>
                    </div>
                    <div className="bg-[#F5F1E8]/50 border border-[#9CA3AF]/30 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        <span className="text-[8px] font-semibold text-gray-500 uppercase">Style</span>
                      </div>
                      <p className="text-[9px] text-gray-900">{currentExampleData.config.style}</p>
                    </div>
                  </motion.div>
                )}

                {/* Knowledge Base */}
                {previewStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg border border-[#9CA3AF]/30 p-2"
                  >
                    <div className="flex items-center gap-1 mb-1.5">
                      <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-[8px] font-semibold text-gray-500 uppercase">Knowledge Base</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {currentExampleData.knowledge.map((item, idx) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.1, duration: 0.2 }}
                          className="px-1.5 py-0.5 bg-[#F5F1E8] text-[8px] text-gray-700 rounded border border-[#9CA3AF]/30"
                        >
                          {item}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Test & Voice Row */}
                {previewStage >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 gap-1.5"
                  >
                    {/* Test Result */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-2.5 h-2.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[8px] font-semibold text-green-700 uppercase">Test Passed</span>
                      </div>
                      <p className="text-[8px] text-gray-600 italic">&ldquo;{currentExampleData.testQuestion}&rdquo;</p>
                    </div>

                    {/* Voice Mode */}
                    <div className="bg-[#8FB7C5]/10 border border-[#8FB7C5]/30 rounded-lg p-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            <span className="text-[8px] font-semibold text-[#8FB7C5] uppercase">Voice</span>
                          </div>
                          <p className="text-[7px] text-gray-500">Enabled</p>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-[#8FB7C5] rounded-full"
                              animate={{ height: [4, 10, 4] }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
