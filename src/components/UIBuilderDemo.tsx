"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import UIPreview from "./UIPreview";

export default function UIBuilderDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const examples = [
    {
      userMessage: "Create a revenue dashboard with metric cards and weekly chart",
      buildingSteps: [
        "Analyzing requirements...",
        "Creating dashboard layout...",
        "Building metric cards...",
        "Generating chart components...",
        "Finalizing design..."
      ],
      aiResponse: "I've created your revenue dashboard! It includes three metric cards showing Revenue ($45.2K), Orders (1,234), and Users (892), each with growth percentages. Below that is an interactive weekly revenue chart showing your performance across the week.",
      type: "dashboard"
    },
    {
      userMessage: "Build a customer list table with name, email, and status columns",
      buildingSteps: [
        "Setting up table structure...",
        "Creating column headers...",
        "Adding customer data rows...",
        "Styling table cells...",
        "Adding status badges..."
      ],
      aiResponse: "Your customer list table is ready! I've created a clean table with Name, Email, Company, and Status columns. Each row shows customer data with color-coded status badges (Active/Inactive) for easy scanning.",
      type: "table"
    },
    {
      userMessage: "Create a contact form with name, email, phone, and message fields",
      buildingSteps: [
        "Designing form layout...",
        "Adding input fields...",
        "Creating field labels...",
        "Styling form elements...",
        "Adding submit button..."
      ],
      aiResponse: "I've built your contact form! It includes clean input fields for Name, Email, Phone Number, and a larger text area for the message. The form has a professional layout with proper spacing and a submit button.",
      type: "form"
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

      // Show user message first with delay
      setTimeout(() => {
        setShowUserMessage(true);
      }, 500);

      // Progress through building stages
      const stageIntervals = [2000, 2000, 2000, 2000, 1500];
      let currentStage = 0;

      const progressStages = () => {
        if (currentStage < currentExampleData.buildingSteps.length) {
          setTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, stageIntervals[currentStage] || 1500);
        } else {
          // Building complete, show final response
          setTimeout(() => {
            setShowFinalResponse(true);
            // After AI response finishes typing (around 2-3 seconds) + 3 more seconds to read
            setTimeout(() => {
              // Fade out smoothly
              setFadeOut(true);
              // After fade out animation, move to next example
              setTimeout(() => {
                setCurrentExample((prev) => (prev + 1) % examples.length);
              }, 600);
            }, 6000);
          }, 500);
        }
      };

      // Start building stages after user message appears
      setTimeout(() => {
        progressStages();
      }, 1500);
    };

    runBuildingSequence();
  }, [currentExample]);

  useEffect(() => {
    if (showFinalResponse) {
      // Stream AI final response - much faster
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        currentIndex += 2; // Skip 2 characters at a time for faster streaming
        setAiResponseText(currentExampleData.aiResponse.slice(0, currentIndex));

        if (currentIndex >= currentExampleData.aiResponse.length) {
          clearInterval(typingInterval);
          setShowCursor(false);
        }
      }, 15); // Faster interval

      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
      };
    }
  }, [showFinalResponse, currentExampleData]);

  return (
    <div className="flex h-[600px] bg-white overflow-hidden">
      {/* Left Side - Chat (35%) */}
      <motion.div
        className="w-[35%] border-r border-gray-200 flex flex-col p-6"
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Chat Header */}
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-900 font-futura uppercase tracking-wide">BUILDER CHAT</h3>
          <p className="text-xs text-gray-500 font-futura mt-1">Build anything with just conversation</p>
        </div>

        {/* Messages Area */}
        <div className="flex-1 space-y-3 overflow-hidden">
          {/* User Message - Animates in */}
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
                <svg className="w-3.5 h-3.5 hover:text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </motion.div>
          )}

          {/* Building Progress Steps - always show when building stage > 0 */}
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

          {/* AI Final Response - show below thinking steps */}
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

        {/* Input Area - Disabled/Empty state */}
        <div className="relative mt-4">
          <input
            type="text"
            placeholder="Describe your business or ask questions..."
            className="w-full px-4 py-3 pr-12 rounded-xl bg-white border border-gray-200 text-sm text-gray-500 font-futura focus:outline-none focus:border-waygent-blue transition-colors"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-waygent-blue transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Right Side - Preview (65%) */}
      <motion.div
        className="w-[65%] bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center"
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {buildingStage > 0 ? (
          <UIPreview buildingStage={buildingStage} exampleType={currentExampleData.type} />
        ) : (
          <div className="text-center">
            <div className="text-gray-400 font-futura text-sm">
              Preview will appear here...
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
