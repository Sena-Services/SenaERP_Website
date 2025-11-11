"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentsBuilderDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
      setTimeout(() => {
        setShowUserMessage(true);
      }, 200);

      // Progress through building stages - matching UI builder pace
      const stageIntervals = [600, 600, 600, 600, 500];
      let currentStage = 0;

      const progressStages = () => {
        if (currentStage < currentExampleData.buildingSteps.length) {
          setTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, stageIntervals[currentStage] || 600);
        } else {
          // Building complete, show final response
          setTimeout(() => {
            setShowFinalResponse(true);
            // After AI response finishes typing, wait then transition
            setTimeout(() => {
              // On mobile: switch to preview automatically with smooth fade
              if (isMobile) {
                setTimeout(() => {
                  setShowPreview(true);
                }, 500);
                // After showing preview for 4 seconds, fade out and move to next
                setTimeout(() => {
                  setFadeOut(true);
                  setTimeout(() => {
                    setCurrentExample((prev) => (prev + 1) % examples.length);
                  }, 500);
                }, 4500);
              } else {
                // Desktop: fade out and move to next example
                setFadeOut(true);
                setTimeout(() => {
                  setCurrentExample((prev) => (prev + 1) % examples.length);
                }, 400);
              }
            }, 2500);
          }, 150);
        }
      };

      // Start building stages after user message appears (matching UI builder timing)
      setTimeout(() => {
        progressStages();
      }, 400);
    };

    runBuildingSequence();
  }, [currentExample]);

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
    <div className="flex flex-col md:flex-row h-[600px] max-h-[600px] bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden md:rounded-2xl">
      {/* Left Side - Chat Container */}
      <motion.div
        className={`w-full md:w-[35%] flex items-stretch p-4 md:p-6 h-full max-h-full ${
          isMobile && showPreview ? 'hidden' : ''
        }`}
        animate={{ opacity: isMobile && showPreview ? 0 : (fadeOut ? 0 : 1) }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col overflow-hidden h-full" style={{
          boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 15px -5px rgba(0, 0, 0, 0.05)'
        }}>
          {/* Chat Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 font-futura uppercase tracking-wide">AGENTS BUILDER</h3>
            <p className="text-xs text-gray-500 font-futura mt-1">Configure intelligent AI assistants</p>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-3 overflow-hidden p-6">
            {/* User Message */}
            {showUserMessage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                className="flex flex-col items-end"
              >
                <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-2xl max-w-[90%] text-sm font-futura shadow-sm">
                  {currentExampleData.userMessage}
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-futura">
                  <span>Oct 21, 10:00 AM</span>
                </div>
              </motion.div>
            )}

            {/* Building Progress Steps */}
            {buildingStage > 0 && (
              <div className="space-y-2 mt-4">
                {currentExampleData.buildingSteps.slice(0, buildingStage).map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 text-xs font-futura"
                  >
                    {!showFinalResponse && index === buildingStage - 1 ? (
                      <>
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 bg-waygent-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-waygent-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-waygent-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-waygent-blue">{step}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-green-600">✓</span>
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
                className="text-sm font-futura text-gray-700 leading-relaxed mt-3"
              >
                {aiResponseText}
                {showCursor && aiResponseText.length < currentExampleData.aiResponse.length && (
                  <span className="inline-block w-0.5 h-4 bg-gray-900 ml-1 animate-pulse" />
                )}
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="relative p-6 pt-0">
            <input
              type="text"
              placeholder="Describe your agent..."
              className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 font-futura focus:outline-none focus:border-waygent-blue transition-colors"
            />
            <button className="absolute right-9 top-3 text-gray-400 hover:text-waygent-blue transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Agent Configuration Preview */}
      <motion.div
        className={`w-full md:w-[65%] flex items-center justify-center p-4 md:p-6 md:pl-0 h-full max-h-full overflow-y-auto ${
          isMobile && !showPreview ? 'hidden' : ''
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: (isMobile && showPreview) || !isMobile ? (fadeOut ? 0 : 1) : 0 }}
        transition={{ duration: 0.5 }}
      >
        {buildingStage > 0 ? (
          <div className="w-full max-w-2xl space-y-3 py-4">
            {/* Agent Card Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: buildingStage >= 1 ? 1 : 0, y: buildingStage >= 1 ? 0 : 20 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-waygent-blue/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-waygent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-futura font-bold text-base text-gray-900">{currentExampleData.agentName}</h3>
                  <p className="text-xs text-gray-500 font-futura">AI Agent • Active</p>
                </div>
                <div className="px-2.5 py-1 bg-green-50 border border-green-200 rounded-md">
                  <span className="text-[10px] font-futura font-semibold text-green-700 uppercase">Live</span>
                </div>
              </div>
            </motion.div>

            {/* Configuration Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Personality */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 1 ? 1 : 0, scale: buildingStage >= 1 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[10px] font-futura font-semibold text-gray-700 uppercase">Personality</span>
                </div>
                <p className="text-xs font-futura text-gray-900">{currentExampleData.agentConfig.personality}</p>
              </motion.div>

              {/* Response Length */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 2 ? 1 : 0, scale: buildingStage >= 2 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span className="text-[10px] font-futura font-semibold text-gray-700 uppercase">Response Length</span>
                </div>
                <p className="text-xs font-futura text-gray-900">{currentExampleData.agentConfig.responseLength}</p>
              </motion.div>

              {/* Creativity */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 2 ? 1 : 0, scale: buildingStage >= 2 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span className="text-[10px] font-futura font-semibold text-gray-700 uppercase">Creativity</span>
                </div>
                <p className="text-xs font-futura text-gray-900">{currentExampleData.agentConfig.creativity}</p>
              </motion.div>

              {/* Style */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: buildingStage >= 2 ? 1 : 0, scale: buildingStage >= 2 ? 1 : 0.9 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 p-3"
              >
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span className="text-[10px] font-futura font-semibold text-gray-700 uppercase">Style</span>
                </div>
                <p className="text-xs font-futura text-gray-900">{currentExampleData.agentConfig.style}</p>
              </motion.div>
            </div>

            {/* Knowledge Base */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: buildingStage >= 3 ? 1 : 0, y: buildingStage >= 3 ? 0 : 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-xs font-futura font-semibold text-gray-700 uppercase">Knowledge Base</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentExampleData.agentConfig.knowledge.map((item, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-gray-50 text-[10px] font-futura text-gray-700 rounded-md border border-gray-200">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Test Response Preview */}
            {buildingStage >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-futura font-semibold text-green-600 uppercase">Test Passed</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-xs font-futura text-gray-600 mb-2">Sample Question:</p>
                  <p className="text-xs font-futura text-gray-900 italic">"What's your refund policy?"</p>
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-xs font-futura text-gray-600 mb-1">Agent Response:</p>
                    <p className="text-xs font-futura text-gray-900 leading-relaxed">✓ Response generated successfully</p>
                  </div>
                </div>
              </motion.div>
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
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
