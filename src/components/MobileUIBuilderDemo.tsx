"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import UIPreview from "./UIPreview";

type MobileUIBuilderDemoProps = {
  isVisible?: boolean;
};

export default function MobileUIBuilderDemo({ isVisible = true }: MobileUIBuilderDemoProps) {
  const [currentExample, setCurrentExample] = useState(0);
  const [phase, setPhase] = useState<"chat" | "preview">("chat");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  const examples = [
    {
      userMessage: "Create a revenue dashboard with metric cards and weekly chart",
      buildingSteps: [
        "Creating layout...",
        "Building cards...",
        "Adding chart..."
      ],
      aiResponse: "Perfect! I've created your revenue dashboard with three key metric cards displaying Revenue ($45.2K with +12.5% growth), Orders (1,234 with +8.2% growth), and Users (892 with +5.7% growth). Below that, there's an interactive weekly revenue chart showing your performance trends across all seven days of the week. The dashboard uses a clean, modern design with smooth animations and is fully responsive. All metrics update in real-time and the chart visualizes your data beautifully with gradient bars.",
      type: "dashboard" as const
    },
    {
      userMessage: "Build a customer list table with name, email, and status columns",
      buildingSteps: [
        "Creating table...",
        "Adding columns...",
        "Styling rows..."
      ],
      aiResponse: "Your customer list table is complete! I've built a clean, organized table with three columns: Name, Email, and Status. The table includes sample data for John Smith, Sarah Johnson, and Mike Davis. Each row has color-coded status badges - green for Active customers and gray for Inactive ones. The table features hover effects for better interactivity, proper spacing for readability, and a professional header row. It's fully responsive and ready to display your customer data.",
      type: "table" as const
    },
    {
      userMessage: "Create a contact form with name, email, phone, and message fields",
      buildingSteps: [
        "Designing form...",
        "Adding fields...",
        "Styling inputs..."
      ],
      aiResponse: "Done! I've built your contact form with a clean, professional layout. It includes input fields for Name and Email, plus a larger text area for the Message field. All fields have proper labels and placeholder text to guide users. The form uses modern styling with rounded corners, subtle borders, and focus states that highlight in blue when users click into a field. At the bottom, there's a prominent Submit button. The entire form is mobile-friendly and provides a great user experience.",
      type: "form" as const
    }
  ];

  const currentExampleData = examples[currentExample];

  useEffect(() => {
    if (!isVisible) {
      // Reset when not visible
      setPhase("chat");
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    // Start animation sequence
    const runSequence = () => {
      // FULL Reset - wait for animations to complete before starting
      setPhase("chat");
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowCursor(true);

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
              // 5. Show preview for a bit, then FULLY RESET before next example
              timeouts.push(setTimeout(() => {
                // Reset everything first
                setPhase("chat");
                setShowUserMessage(false);
                setBuildingStage(0);
                setShowFinalResponse(false);
                setAiResponseText("");
                setShowCursor(true);

                // Then move to next example after a brief pause
                timeouts.push(setTimeout(() => {
                  setCurrentExample((prev) => (prev + 1) % examples.length);
                }, 300));
              }, 3000));
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
      {/* Fixed height container - Always visible */}
      <div
        className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl overflow-hidden border border-gray-200"
        style={{ height: '420px' }}
      >
        <AnimatePresence mode="wait">
          {phase === "chat" ? (
            // CHAT PHASE - Shows chat conversation
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
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Builder Chat</h3>
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

                {/* AI Final Response - plain text like desktop, not in bubble */}
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
                    placeholder="Describe what to build..."
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
            // PREVIEW PHASE - Shows component preview only
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="h-full bg-white rounded-2xl overflow-hidden"
            >
              {/* Browser Chrome */}
              <div className="bg-gray-100 px-2.5 py-2 border-b border-gray-200 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 font-mono ml-1">Preview</span>
              </div>

              {/* Preview Content */}
              <div className="p-2" style={{ height: 'calc(420px - 38px)', overflow: 'hidden' }}>
                <UIPreview buildingStage={5} exampleType={currentExampleData.type} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
