"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function AgentsBuilderDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useIsMobile();
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const examples = [
    {
      userMessage: "Create a sales agent that handles product questions and pricing",
      agentName: "Sales Assistant",
      buildingSteps: [
        "Configuring agent personality...",
        "Setting response style and length...",
        "Adding knowledge base (docs, FAQs)...",
        "Testing agent responses...",
        "Agent ready!"
      ],
      aiResponse: "I've built your sales agent! It's configured with a friendly personality, detailed responses, and has access to your product docs and FAQs. The agent can handle product questions, pricing inquiries, and will respond in a helpful, professional manner.",
      agentConfig: {
        personality: "Professional & Friendly",
        responseLength: "Detailed",
        creativity: "Medium",
        knowledge: ["Product Docs", "FAQs", "Pricing"],
        style: "Step-by-step"
      }
    },
    {
      userMessage: "Build a support agent for technical troubleshooting",
      agentName: "Support Agent",
      buildingSteps: [
        "Setting technical tone...",
        "Configuring response format...",
        "Linking technical documentation...",
        "Testing troubleshooting flows...",
        "Agent configured!"
      ],
      aiResponse: "Your technical support agent is ready! It uses a professional tone with step-by-step troubleshooting instructions. The agent has access to technical docs and common issues, and will guide users through solutions systematically.",
      agentConfig: {
        personality: "Technical & Patient",
        responseLength: "Detailed",
        creativity: "Low",
        knowledge: ["Tech Docs", "Common Issues", "API Guides"],
        style: "Step-by-step"
      }
    },
    {
      userMessage: "Create a customer onboarding agent to guide new users",
      agentName: "Onboarding Guide",
      buildingSteps: [
        "Setting welcoming tone...",
        "Configuring onboarding flow...",
        "Adding training materials...",
        "Testing user interactions...",
        "Agent ready!"
      ],
      aiResponse: "Your onboarding agent is live! It greets new users warmly and guides them through setup with interactive tutorials. The agent has access to training materials and best practices, ensuring every user gets started on the right foot.",
      agentConfig: {
        personality: "Welcoming & Supportive",
        responseLength: "Concise",
        creativity: "Medium",
        knowledge: ["Onboarding Guide", "Training Videos", "Best Practices"],
        style: "Interactive"
      }
    }
  ];

  const currentExampleData = examples[currentExample];

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const runBuildingSequence = () => {
      // Reset state
      setFadeOut(false);
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowCursor(true);
      setShowPreview(false);

      // Show user message first with delay (matching UI builder)
      safeTimeout(() => {
        setShowUserMessage(true);
      }, 200);

      // Progress through building stages - slower, more deliberate
      const stageIntervals = [800, 800, 800, 700, 600];
      let currentStage = 0;

      const progressStages = () => {
        if (currentStage < currentExampleData.buildingSteps.length) {
          safeTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, stageIntervals[currentStage] || 700);
        } else {
          // Building complete, show final response
          safeTimeout(() => {
            setShowFinalResponse(true);
            // After AI response finishes typing, wait then transition
            safeTimeout(() => {
              // On mobile: switch to preview automatically with smooth fade
              if (isMobile) {
                safeTimeout(() => {
                  setShowPreview(true);
                }, 600);
                // After showing preview for 5 seconds, fade out and move to next
                safeTimeout(() => {
                  setFadeOut(true);
                  safeTimeout(() => {
                    setCurrentExample((prev) => (prev + 1) % examples.length);
                  }, 600);
                }, 5500);
              } else {
                // Desktop: hold longer then fade out and move to next example
                safeTimeout(() => {
                  setFadeOut(true);
                  safeTimeout(() => {
                    setCurrentExample((prev) => (prev + 1) % examples.length);
                  }, 500);
                }, 4000); // 4 second hold on desktop
              }
            }, 2000);
          }, 200);
        }
      };

      // Start building stages after user message appears
      safeTimeout(() => {
        progressStages();
      }, 500);
    };

    runBuildingSequence();

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [currentExample, safeTimeout]);

  useEffect(() => {
    if (showFinalResponse) {
      // Stream AI final response
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex >= currentExampleData.aiResponse.length) {
          clearInterval(typingInterval);
          setShowCursor(false);
          return;
        }

        currentIndex += 4;
        setAiResponseText(currentExampleData.aiResponse.slice(0, currentIndex));
      }, 15);

      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
      };
    } else {
      setAiResponseText("");
      setShowCursor(true);
    }
  }, [showFinalResponse]);

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden md:rounded-2xl" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Left Side - Chat Container */}
      <motion.div
        className={`w-full md:w-[35%] flex items-stretch p-2 md:p-3 h-full max-h-full ${
          isMobile && showPreview ? 'hidden' : ''
        }`}
        animate={{ opacity: isMobile && showPreview ? 0 : (fadeOut ? 0 : 1) }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col overflow-hidden h-full" style={{
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 15px -5px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Chat Header */}
          <div className="px-2.5 py-2 bg-[#F5F1E8] border-b border-[#9CA3AF]/30 rounded-t-xl flex-shrink-0">
            <h3 className="text-xs font-bold text-gray-900 font-futura uppercase tracking-wide">AGENTS BUILDER</h3>
            <p className="text-[10px] text-gray-500 font-futura mt-0.5">Configure intelligent AI assistants</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-2 overflow-hidden p-3">
            {/* User Message */}
            {showUserMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-end"
              >
                <div className="bg-white border border-gray-200 text-gray-900 px-2.5 py-1.5 rounded-lg max-w-[90%] text-[11px] font-futura shadow-sm leading-snug">
                  {currentExampleData.userMessage}
                </div>
                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-futura">
                  <span>Oct 21, 10:00 AM</span>
                </div>
              </motion.div>
            )}

            {/* Building Progress Steps */}
            {buildingStage > 0 && (
              <div className="space-y-1 mt-2">
                {currentExampleData.buildingSteps.slice(0, buildingStage).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-1.5 text-[10px] font-futura"
                  >
                    {!showFinalResponse && index === buildingStage - 1 ? (
                      <>
                        <div className="flex items-center gap-0.5">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-[#8FB7C5] rounded-full"
                              animate={{
                                height: [4, 8, 4],
                              }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                delay: i * 0.1,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                        <span className="text-[#6BA3B5]">{step}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-500">{step}</span>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* AI Final Response */}
            {showFinalResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-[11px] font-futura text-gray-700 leading-snug mt-1.5"
              >
                {aiResponseText}
                {showCursor && aiResponseText.length < currentExampleData.aiResponse.length && (
                  <span className="inline-block w-0.5 h-3 bg-gray-900 ml-0.5 animate-pulse" />
                )}
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="relative px-2.5 pb-2.5 pt-0 flex-shrink-0">
            <input
              type="text"
              placeholder="Describe your agent..."
              className="w-full px-2.5 py-1.5 pr-8 rounded-lg bg-[#F5F1E8]/50 border border-[#9CA3AF]/50 text-[11px] text-gray-500 font-futura focus:outline-none focus:border-[#8FB7C5] transition-colors"
            />
            <button className="absolute right-3.5 top-1.5 text-[#8FB7C5] hover:text-[#6BA3B5] transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Agent Configuration Preview */}
      <motion.div
        className={`w-full md:w-[65%] flex items-center justify-center p-2 md:p-3 md:pl-0 h-full max-h-full overflow-hidden ${
          isMobile && !showPreview ? 'hidden' : ''
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: (isMobile && showPreview) || !isMobile ? (fadeOut ? 0 : 1) : 0 }}
        transition={{ duration: 0.5 }}
      >
        {buildingStage > 0 ? (
          <div className="w-full max-w-2xl space-y-1.5 py-1">
            {/* Agent Card Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: buildingStage >= 1 ? 1 : 0, y: buildingStage >= 1 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md border border-[#9CA3AF] p-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#8FB7C5]/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-futura font-bold text-xs text-gray-900 truncate">{currentExampleData.agentName}</h3>
                  <p className="text-[9px] text-gray-500 font-futura">AI Agent • Active</p>
                </div>
                <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded-md flex-shrink-0 self-center">
                  <span className="text-[9px] font-futura font-semibold text-emerald-700 uppercase leading-none">Live</span>
                </div>
              </div>
            </motion.div>

            {/* Configuration Cards Grid */}
            <div className="grid grid-cols-2 gap-2">
              {/* Personality */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 1 ? 1 : 0, scale: buildingStage >= 1 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-lg border border-[#9CA3AF] p-2"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-[#8FB7C5]/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-futura font-semibold text-gray-600 uppercase">Personality</span>
                </div>
                <p className="text-[10px] font-futura text-gray-900 font-medium">{currentExampleData.agentConfig.personality}</p>
              </motion.div>

              {/* Response Length */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 2 ? 1 : 0, scale: buildingStage >= 2 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-lg border border-[#9CA3AF] p-2"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-[#8FB7C5]/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-futura font-semibold text-gray-600 uppercase">Response Length</span>
                </div>
                <p className="text-[10px] font-futura text-gray-900 font-medium">{currentExampleData.agentConfig.responseLength}</p>
              </motion.div>

              {/* Creativity */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 2 ? 1 : 0, scale: buildingStage >= 2 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-lg border border-[#9CA3AF] p-2"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-[#8FB7C5]/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-futura font-semibold text-gray-600 uppercase">Creativity</span>
                </div>
                <p className="text-[10px] font-futura text-gray-900 font-medium">{currentExampleData.agentConfig.creativity}</p>
              </motion.div>

              {/* Style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 2 ? 1 : 0, scale: buildingStage >= 2 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-lg border border-[#9CA3AF] p-2"
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-[#8FB7C5]/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-futura font-semibold text-gray-600 uppercase">Style</span>
                </div>
                <p className="text-[10px] font-futura text-gray-900 font-medium">{currentExampleData.agentConfig.style}</p>
              </motion.div>
            </div>

            {/* Knowledge Base */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: buildingStage >= 3 ? 1 : 0, y: buildingStage >= 3 ? 0 : 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg border border-[#9CA3AF] p-2"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-5 h-5 rounded bg-[#8FB7C5]/15 flex items-center justify-center">
                  <svg className="w-3 h-3 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-[9px] font-futura font-semibold text-gray-600 uppercase">Knowledge Base</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {currentExampleData.agentConfig.knowledge.map((item, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="px-2 py-0.5 bg-[#F5F1E8] text-[9px] font-futura text-gray-700 rounded-md border border-[#9CA3AF]/50"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Test Response Preview */}
            {buildingStage >= 4 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-lg border border-[#9CA3AF] p-2"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-5 h-5 rounded bg-emerald-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[9px] font-futura font-semibold text-emerald-600 uppercase">Test Passed</span>
                  </div>
                  <div className="bg-[#FAFAF8] rounded-lg p-2 border border-[#9CA3AF]/30">
                    <p className="text-[9px] font-futura text-gray-500 mb-0.5">Sample Question:</p>
                    <p className="text-[9px] font-futura text-gray-900 italic">&quot;What&apos;s your refund policy?&quot;</p>
                    <div className="mt-1.5 pt-1.5 border-t border-[#9CA3AF]/30">
                      <p className="text-[9px] font-futura text-gray-500 mb-0.5">Agent Response:</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-[9px] font-futura text-gray-900">Response generated successfully</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Voice Mode Test */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-[#F5F1E8] to-[#E8E4DB] rounded-lg border border-[#8FB7C5] p-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-5 h-5 rounded bg-[#8FB7C5]/20 flex items-center justify-center">
                          <svg className="w-3 h-3 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </div>
                        <span className="text-[9px] font-futura font-semibold text-[#5B8A8A] uppercase">Voice Mode</span>
                      </div>
                      <p className="text-[9px] font-futura text-gray-600">Test agent with voice interactions</p>
                    </div>
                    {/* Animated Voice Waves */}
                    <div className="flex items-center gap-0.5 mr-2">
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <motion.div
                          key={i}
                          className="w-0.5 bg-[#8FB7C5] rounded-full"
                          animate={{
                            height: [6, 14, 6],
                          }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            delay: i * 0.08,
                            ease: "easeInOut"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center text-center max-w-md"
          >
            <div className="mb-6">
              <div className="w-20 h-20 bg-[#F5F1E8] rounded-xl flex items-center justify-center border border-[#9CA3AF]">
                <svg className="w-10 h-10 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h4 className="text-base font-semibold text-gray-900 font-futura mb-2">
              Your agent will appear here
            </h4>
            <p className="text-sm text-gray-500 font-futura leading-relaxed">
              Watch as your AI assistant is configured with personality, knowledge, and response style
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
