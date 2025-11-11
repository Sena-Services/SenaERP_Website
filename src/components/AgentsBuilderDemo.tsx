"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AgentConfig {
  label: string;
  value: string;
  icon: string;
}

export default function AgentsBuilderDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [showTestChat, setShowTestChat] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const examples = [
    {
      request: "Create a sales agent that helps with product inquiries and pricing",
      buildingSteps: [
        { step: "Configuring agent personality", detail: "Professional, helpful tone" },
        { step: "Adding knowledge base", detail: "Product catalog, pricing, policies" },
        { step: "Setting response style", detail: "Concise, friendly, informative" },
        { step: "Configuring guardrails", detail: "No discounts without approval" }
      ],
      agentConfig: [
        { label: "Name", value: "Sales Assistant", icon: "🤖" },
        { label: "Personality", value: "Professional & Helpful", icon: "✨" },
        { label: "Knowledge", value: "Products, Pricing, Policies", icon: "📚" },
        { label: "Style", value: "Concise & Friendly", icon: "💬" }
      ],
      testQuestion: "What's the price for the Pro plan?",
      testResponse: "The Pro plan is $49/month. It includes unlimited users, advanced analytics, and priority support. We also offer a 30-day money-back guarantee. Would you like to schedule a demo?"
    },
    {
      request: "Build a customer support agent that handles technical issues",
      buildingSteps: [
        { step: "Configuring agent personality", detail: "Patient, technical, empathetic" },
        { step: "Adding knowledge base", detail: "Documentation, troubleshooting guides" },
        { step: "Setting response style", detail: "Step-by-step, detailed explanations" },
        { step: "Configuring guardrails", detail: "Escalate complex issues to human" }
      ],
      agentConfig: [
        { label: "Name", value: "Support Specialist", icon: "🛟" },
        { label: "Personality", value: "Patient & Technical", icon: "🔧" },
        { label: "Knowledge", value: "Docs, Troubleshooting, FAQs", icon: "📖" },
        { label: "Style", value: "Step-by-step & Detailed", icon: "📝" }
      ],
      testQuestion: "My dashboard isn't loading properly",
      testResponse: "I can help you fix that! Let's troubleshoot step by step:\n\n1. Clear your browser cache and cookies\n2. Try accessing in an incognito window\n3. Check if other pages load correctly\n\nIf the issue persists after these steps, I'll escalate this to our technical team for immediate assistance."
    },
    {
      request: "Create an onboarding agent that guides new users",
      buildingSteps: [
        { step: "Configuring agent personality", detail: "Welcoming, encouraging, patient" },
        { step: "Adding knowledge base", detail: "Setup guides, tutorials, best practices" },
        { step: "Setting response style", detail: "Conversational, educational" },
        { step: "Configuring guardrails", detail: "Recommend tutorials, no advanced features" }
      ],
      agentConfig: [
        { label: "Name", value: "Onboarding Guide", icon: "🎓" },
        { label: "Personality", value: "Welcoming & Encouraging", icon: "👋" },
        { label: "Knowledge", value: "Tutorials, Setup Guides", icon: "📘" },
        { label: "Style", value: "Conversational & Educational", icon: "💡" }
      ],
      testQuestion: "I just signed up. Where do I start?",
      testResponse: "Welcome aboard! 🎉 I'm excited to help you get started!\n\nHere's your quick setup path:\n1. Complete your profile (2 min)\n2. Take our interactive tutorial (5 min)\n3. Create your first project\n\nWould you like me to guide you through the profile setup first?"
    }
  ];

  const currentData = examples[currentExample];

  useEffect(() => {
    const runSequence = () => {
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setShowTestChat(false);
      setAiResponseText("");
      setShowCursor(true);
      setFadeOut(false);

      // Show user message first
      setTimeout(() => {
        setShowUserMessage(true);
      }, 200);

      // Progress through building stages
      const stageInterval = 900;
      let currentStage = 0;

      const progressStages = () => {
        if (currentStage < currentData.buildingSteps.length) {
          setTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, stageInterval);
        } else {
          // All stages complete, show test chat
          setTimeout(() => {
            setShowTestChat(true);
            // Show final response after test chat appears
            setTimeout(() => {
              setShowFinalResponse(true);
              // Hold for 3.5 seconds
              setTimeout(() => {
                setFadeOut(true);
                setTimeout(() => {
                  setCurrentExample((prev) => (prev + 1) % examples.length);
                }, 600);
              }, 3500);
            }, 1000);
          }, 300);
        }
      };

      // Start building stages after user message
      setTimeout(() => {
        progressStages();
      }, 600);
    };

    runSequence();
  }, [currentExample]);

  // Stream AI response
  useEffect(() => {
    if (showFinalResponse) {
      const response = `Agent configured! Your ${currentData.agentConfig[0].value} is ready to handle inquiries with a ${currentData.agentConfig[1].value.toLowerCase()} approach.`;
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex >= response.length) {
          clearInterval(typingInterval);
          setShowCursor(false);
          return;
        }
        currentIndex += 3;
        setAiResponseText(response.slice(0, currentIndex));
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
  }, [showFinalResponse, currentData]);

  return (
    <div className="flex h-[600px] bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden">
      {/* Left Side - Chat Container (35%) */}
      {!fadeOut && (
        <motion.div
          className="w-[35%] flex items-stretch p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Builder Chat Box */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col overflow-hidden h-full" style={{
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 15px -5px rgba(0, 0, 0, 0.05)'
          }}>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 font-futura uppercase tracking-wide">AGENTS BUILDER</h3>
              <p className="text-xs text-gray-500 font-futura mt-1">Create intelligent AI assistants</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-3 overflow-hidden p-6">
              {/* User Message */}
              {showUserMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-end"
                >
                  <div className="bg-white border border-gray-200 text-gray-900 px-4 py-3 rounded-2xl max-w-[90%] text-sm font-futura shadow-sm">
                    {currentData.request}
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 font-futura">
                    <span>Oct 21, 10:00 AM</span>
                    <svg className="w-3.5 h-3.5 hover:text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </motion.div>
              )}

              {/* Building Progress Steps */}
              {buildingStage > 0 && (
                <div className="space-y-2 mt-4">
                  {currentData.buildingSteps.slice(0, buildingStage).map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-start gap-2 text-xs font-futura"
                    >
                      {!showTestChat && index === buildingStage - 1 ? (
                        <>
                          <div className="flex gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-waygent-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-waygent-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-waygent-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <div className="flex-1">
                            <span className="text-waygent-blue block">{item.step}...</span>
                            <span className="text-gray-400 text-[10px]">{item.detail}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <span className="text-green-600 mt-0.5">✓</span>
                          <div className="flex-1">
                            <span className="text-gray-500 block">{item.step}</span>
                            <span className="text-gray-400 text-[10px]">{item.detail}</span>
                          </div>
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
                  {showCursor && aiResponseText.length < 140 && (
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
                disabled
              />
              <button className="absolute right-9 top-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Right Side - Agent Preview (65%) */}
      {!fadeOut && (
        <motion.div
          className="w-[65%] flex items-center justify-center p-6 pl-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative max-w-2xl w-full h-full flex flex-col">
            {buildingStage > 0 ? (
              <>
                {/* Agent Configuration Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-4"
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                    <div className="w-12 h-12 rounded-full bg-waygent-blue/10 flex items-center justify-center text-2xl">
                      {currentData.agentConfig[0].icon}
                    </div>
                    <div>
                      <h3 className="font-futura font-bold text-gray-900">{currentData.agentConfig[0].value}</h3>
                      <p className="text-xs text-gray-500 font-futura">AI Agent Configuration</p>
                    </div>
                  </div>

                  {/* Config Items */}
                  <div className="space-y-3">
                    {currentData.agentConfig.slice(0, buildingStage).map((config, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <span className="text-xl">{config.icon}</span>
                        <div className="flex-1">
                          <p className="text-xs font-futura font-semibold text-gray-600 uppercase tracking-wide">{config.label}</p>
                          <p className="text-sm font-futura text-gray-900">{config.value}</p>
                        </div>
                        <span className="text-green-600 text-sm">✓</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Test Chat Preview */}
                {showTestChat && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 flex-1 flex flex-col overflow-hidden"
                  >
                    {/* Chat Header */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-waygent-blue/10 flex items-center justify-center text-sm">
                        {currentData.agentConfig[0].icon}
                      </div>
                      <div>
                        <p className="text-xs font-futura font-semibold text-gray-900">{currentData.agentConfig[0].value}</p>
                        <p className="text-[10px] font-futura text-green-600">● Online</p>
                      </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-hidden">
                      {/* User Question */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-end"
                      >
                        <div className="bg-waygent-blue text-white px-3 py-2 rounded-lg max-w-[80%] text-xs font-futura">
                          {currentData.testQuestion}
                        </div>
                      </motion.div>

                      {/* Agent Response */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gray-100 text-gray-900 px-3 py-2 rounded-lg max-w-[80%] text-xs font-futura leading-relaxed whitespace-pre-line">
                          {currentData.testResponse}
                        </div>
                      </motion.div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 bg-transparent text-xs font-futura text-gray-400 focus:outline-none"
                          disabled
                        />
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center h-full"
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
                <p className="text-sm text-gray-500 font-futura leading-relaxed max-w-sm">
                  Watch as your AI assistant is configured and tested in real-time
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
