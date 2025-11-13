"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [showConfig, setShowConfig] = useState(false);

  const examples = [
    {
      userMessage: "Create a sales agent that handles product questions and pricing",
      agentName: "Sales Assistant",
      buildingSteps: [
        "Setting personality...",
        "Adding knowledge...",
        "Testing responses..."
      ],
      aiResponse: "Perfect! Your sales agent is ready. It's configured with a friendly personality, detailed responses, and has access to your product docs and FAQs. The agent can handle product questions, pricing inquiries, and will respond in a helpful, professional manner.",
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
        "Adding documentation...",
        "Testing flows..."
      ],
      aiResponse: "Done! Your technical support agent is ready. It uses a professional tone with step-by-step troubleshooting instructions. The agent has access to technical docs and common issues, and will guide users through solutions systematically.",
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
        "Adding training materials...",
        "Testing interactions..."
      ],
      aiResponse: "All set! Your onboarding agent is live. It greets new users warmly and guides them through setup with interactive tutorials. The agent has access to training materials and best practices, ensuring every user gets started on the right foot.",
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
    if (!isVisible) {
      setPhase("chat");
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowConfig(false);
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
      setShowConfig(false);

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
              // Show config gradually
              timeouts.push(setTimeout(() => setShowConfig(true), 300));

              // 5. Show preview for a bit, then reset and move to next
              timeouts.push(setTimeout(() => {
                setPhase("chat");
                setShowUserMessage(false);
                setBuildingStage(0);
                setShowFinalResponse(false);
                setAiResponseText("");
                setShowCursor(true);
                setShowConfig(false);

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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col bg-white"
            >
              {/* Chat Header */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Agent Builder</h3>
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
                    placeholder="Describe your agent..."
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
            // PREVIEW PHASE - Agent Configuration
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
                <span className="text-xs text-gray-500 font-mono ml-1">Agent Preview</span>
              </div>

              {/* Agent Configuration */}
              <div className="p-2 overflow-y-auto" style={{ height: 'calc(420px - 38px)' }}>
                {showConfig && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2"
                  >
                    {/* Agent Card Header */}
                    <div className="bg-white rounded-lg border border-gray-200 p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center">
                          <svg className="w-4 h-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-bold text-gray-900">{currentExampleData.agentName}</h3>
                          <p className="text-[10px] text-gray-500">AI Agent • Active</p>
                        </div>
                        <div className="px-1.5 py-0.5 bg-green-50 border border-green-200 rounded">
                          <span className="text-[9px] font-semibold text-green-700">LIVE</span>
                        </div>
                      </div>
                    </div>

                    {/* Configuration Cards Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Personality */}
                      <div className="bg-white rounded-lg border border-gray-200 p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-700 uppercase">Personality</span>
                        </div>
                        <p className="text-[10px] text-gray-900">{currentExampleData.agentConfig.personality}</p>
                      </div>

                      {/* Response Length */}
                      <div className="bg-white rounded-lg border border-gray-200 p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-700 uppercase">Length</span>
                        </div>
                        <p className="text-[10px] text-gray-900">{currentExampleData.agentConfig.responseLength}</p>
                      </div>

                      {/* Creativity */}
                      <div className="bg-white rounded-lg border border-gray-200 p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-700 uppercase">Creativity</span>
                        </div>
                        <p className="text-[10px] text-gray-900">{currentExampleData.agentConfig.creativity}</p>
                      </div>

                      {/* Style */}
                      <div className="bg-white rounded-lg border border-gray-200 p-2">
                        <div className="flex items-center gap-1 mb-1">
                          <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="text-[9px] font-semibold text-gray-700 uppercase">Style</span>
                        </div>
                        <p className="text-[10px] text-gray-900">{currentExampleData.agentConfig.style}</p>
                      </div>
                    </div>

                    {/* Knowledge Base */}
                    <div className="bg-white rounded-lg border border-gray-200 p-2">
                      <div className="flex items-center gap-1 mb-1.5">
                        <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-[9px] font-semibold text-gray-700 uppercase">Knowledge Base</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {currentExampleData.agentConfig.knowledge.map((item, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-gray-50 text-[9px] text-gray-700 rounded border border-gray-200">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Voice Mode Test */}
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg border border-pink-200 p-3 mt-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-1 mb-0.5">
                            <svg className="w-3 h-3 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            <span className="text-[9px] font-semibold text-pink-900 uppercase">Voice Mode</span>
                          </div>
                          <p className="text-[9px] text-pink-700">Click to enable voice mode to test it out</p>
                        </div>
                        {/* Animated Voice Waves */}
                        <div className="flex items-center gap-0.5">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-pink-500 rounded-full"
                              animate={{
                                height: [8, 16, 8],
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
