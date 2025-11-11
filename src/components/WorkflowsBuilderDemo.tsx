"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WorkflowStep {
  icon: string;
  title: string;
  technicalDetails: { label: string; value: string }[];
  naturalLanguage: string;
}

export default function WorkflowsBuilderDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const examples = [
    {
      request: "When a new lead submits the form, send notification to Slack and create task",
      steps: [
        {
          icon: "⚡",
          title: "TRIGGER",
          technicalDetails: [
            { label: "Event", value: "onCreate" },
            { label: "DocType", value: "Lead" },
            { label: "Timing", value: "Immediate" }
          ],
          naturalLanguage: "This workflow is triggered automatically when a new Contact record is created. Specifically, it runs immediately after a new contact is inserted into the system."
        },
        {
          icon: "📄",
          title: "READ DATA",
          technicalDetails: [
            { label: "Data", value: "Lead" },
            { label: "Fields", value: "name, email, company" },
            { label: "Output", value: "lead_data" }
          ],
          naturalLanguage: "The workflow begins by logging a message to the console indicating the start of the process. This message includes the first name and last name of the newly created contact, providing an audit trail of the workflow's initiation."
        },
        {
          icon: "💬",
          title: "SLACK NOTIFICATION",
          technicalDetails: [
            { label: "Channel", value: "#sales" },
            { label: "Message", value: "New lead: {{name}}" },
            { label: "Include", value: "Form link + details" }
          ],
          naturalLanguage: "The workflow retrieves the Administrator user account and saves it for later use. This allows the workflow to access the name, email, and full name of the Administrator, enabling subsequent actions to use this information."
        },
        {
          icon: "✓",
          title: "CREATE TASK",
          technicalDetails: [
            { label: "Platform", value: "Asana" },
            { label: "Assignee", value: "Sales Team" },
            { label: "Priority", value: "High" }
          ],
          naturalLanguage: "The workflow lists up to five enabled User documents from the system. This creates a list of active users which can be used in subsequent steps for tasks like reporting or notifications."
        }
      ]
    },
    {
      request: "When order total exceeds $1000, require manager approval before processing",
      steps: [
        {
          icon: "⚡",
          title: "TRIGGER",
          technicalDetails: [
            { label: "Event", value: "onCreate/onUpdate" },
            { label: "DocType", value: "Order" },
            { label: "Monitor", value: "total field" }
          ],
          naturalLanguage: "This workflow triggers when a new Order is created or updated. It monitors order values in real-time to enforce approval policies for high-value transactions."
        },
        {
          icon: "🔀",
          title: "CONDITION",
          technicalDetails: [
            { label: "Field", value: "order.total" },
            { label: "Operator", value: ">" },
            { label: "Value", value: "$1000" }
          ],
          naturalLanguage: "Check if the order total is greater than $1000 to determine if manager approval is required. This ensures proper oversight for significant purchases."
        },
        {
          icon: "📧",
          title: "APPROVAL REQUEST",
          technicalDetails: [
            { label: "To", value: "Manager" },
            { label: "Type", value: "Approval Required" },
            { label: "Actions", value: "Approve / Reject" }
          ],
          naturalLanguage: "Send approval request email to the manager with complete order details and approve/reject action buttons for quick decision-making."
        },
        {
          icon: "⏸️",
          title: "PAUSE & UPDATE",
          technicalDetails: [
            { label: "Action", value: "Pause workflow" },
            { label: "Set Status", value: "Pending Approval" },
            { label: "Wait For", value: "Manager response" }
          ],
          naturalLanguage: "Pause order processing and set status to 'Pending Approval' until manager responds. This prevents premature order fulfillment while maintaining clear status tracking."
        }
      ]
    },
    {
      request: "When inventory drops below 10 units, automatically reorder from supplier",
      steps: [
        {
          icon: "⚡",
          title: "TRIGGER",
          technicalDetails: [
            { label: "Event", value: "onUpdate" },
            { label: "DocType", value: "Inventory" },
            { label: "Monitor", value: "quantity field" }
          ],
          naturalLanguage: "This workflow monitors inventory levels continuously and triggers automatically when stock quantity falls below the reorder threshold of 10 units."
        },
        {
          icon: "🔀",
          title: "CONDITION",
          technicalDetails: [
            { label: "Field", value: "inventory.quantity" },
            { label: "Operator", value: "<" },
            { label: "Value", value: "10" }
          ],
          naturalLanguage: "Check if the current stock level is below 10 units to trigger the automated reorder process and prevent stockouts."
        },
        {
          icon: "🔢",
          title: "CALCULATE",
          technicalDetails: [
            { label: "Input", value: "Sales history" },
            { label: "Formula", value: "avg_daily × lead_time × 2" },
            { label: "Output", value: "reorder_qty" }
          ],
          naturalLanguage: "Calculate optimal reorder quantity based on historical sales data and supplier lead time. The formula accounts for average daily usage multiplied by delivery time with a safety buffer."
        },
        {
          icon: "🛒",
          title: "CREATE PURCHASE ORDER",
          technicalDetails: [
            { label: "Supplier", value: "Default Supplier" },
            { label: "Quantity", value: "{{reorder_qty}}" },
            { label: "Notify", value: "Procurement team" }
          ],
          naturalLanguage: "Create purchase order automatically in the supplier portal with the calculated quantity and send confirmation email to the procurement team for visibility."
        }
      ]
    }
  ];

  const currentData = examples[currentExample];

  useEffect(() => {
    const runSequence = () => {
      // Reset state
      setFadeOut(false);
      setShowUserMessage(false);
      setVisibleSteps(0);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowCursor(true);

      // Show user message first with delay (matching UI builder)
      setTimeout(() => {
        setShowUserMessage(true);
      }, 200);

      // Show steps one by one with building messages
      const stepInterval = 600; // 0.6s per step (faster, matching UI builder pace)
      let currentStep = 0;

      const showNextStep = () => {
        if (currentStep < currentData.steps.length) {
          // Update building stage message
          setBuildingStage(currentStep + 1);
          // Show the actual node
          setTimeout(() => {
            currentStep++;
            setVisibleSteps(currentStep);
            setTimeout(showNextStep, stepInterval);
          }, 100);
        } else {
          // All steps shown, show final response
          setTimeout(() => {
            setShowFinalResponse(true);
            // Hold for 3.5 seconds after AI response finishes (matching UI builder)
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(() => {
                setCurrentExample((prev) => (prev + 1) % examples.length);
              }, 400);
            }, 3500);
          }, 150);
        }
      };

      // Start showing steps after user message appears (matching UI builder timing)
      setTimeout(showNextStep, 400);
    };

    runSequence();
  }, [currentExample]);

  // Stream AI response
  useEffect(() => {
    if (showFinalResponse) {
      const response = `Workflow complete! I've set up ${currentData.steps.length} steps that will automatically handle this process from start to finish.`;
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
  }, [showFinalResponse, currentData.steps.length]);

  return (
    <div className="flex h-[600px] bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden">
      {/* Left Side - Chat Container (35%) */}
      <motion.div
        className="w-[35%] flex items-stretch p-6"
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
          {/* Builder Chat Box - Full height */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col overflow-hidden h-full" style={{
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 15px -5px rgba(0, 0, 0, 0.05)'
          }}>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-900 font-futura uppercase tracking-wide">WORKFLOWS BUILDER</h3>
              <p className="text-xs text-gray-500 font-futura mt-1">Automate any business process</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-3 overflow-hidden p-6">
              {/* User Message - Animates in */}
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
                  {currentData.steps.slice(0, buildingStage).map((step, index) => (
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
                          <span className="text-waygent-blue">Creating {step.title} node...</span>
                        </>
                      ) : (
                        <>
                          <span className="text-green-600">✓</span>
                          <span className="text-gray-500">{step.title} configured</span>
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

            {/* Input Area - Disabled/Empty state */}
            <div className="relative p-6 pt-0">
              <input
                type="text"
                placeholder="Describe your workflow..."
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

      {/* Right Side - Workflow Nodes (65%) */}
      <motion.div
        className="w-[65%] flex items-center justify-center p-6 pl-0"
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
          <div className="relative max-w-2xl w-full h-full flex items-center justify-center">
            {visibleSteps > 0 ? (
              <div className="w-full relative">
                {/* Vertical connecting line - starts FROM first dot, connects to last dot */}
                {visibleSteps > 1 && (
                  <motion.div
                    className="absolute w-0.5 bg-gray-300 z-0"
                    style={{
                      left: '20px',
                      top: '45px', // Center of first card (90px min-height / 2 = 45px)
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(visibleSteps - 1) * 122}px` }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Workflow steps */}
                <div className="space-y-2 relative">
                  {currentData.steps.slice(0, visibleSteps).map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                      className="relative flex items-start"
                    >
                      {/* Connection dot - centered vertically on card */}
                      <div
                        className="absolute w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm z-10"
                        style={{
                          left: '14px',
                          top: '50%',
                          transform: 'translateY(-50%)'
                        }}
                      />

                      {/* Node card */}
                      <div className="ml-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1"
                        style={{
                          minHeight: '90px' // Ensure consistent height for dot alignment
                        }}
                      >
                        {/* Technical section - top */}
                        <div className="px-3 py-1.5 border-b border-gray-200">
                          {/* Header */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-sm">{step.icon}</span>
                            <h4 className="font-futura font-bold text-[9px] uppercase tracking-wide text-gray-900">
                              {step.title}
                            </h4>
                          </div>

                          {/* Technical details */}
                          <div className="space-y-0.5">
                            {step.technicalDetails.map((detail, detailIdx) => (
                              <div key={detailIdx} className="flex items-start text-[9px]">
                                <span className="font-futura font-semibold text-gray-600 min-w-[60px]">
                                  {detail.label}:
                                </span>
                                <span className="font-futura text-gray-800 font-mono text-[8px]">
                                  {detail.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Natural language section - bottom */}
                        <div className="px-3 py-1.5 bg-gray-50">
                          <p className="text-[8px] font-futura text-gray-600 leading-snug">
                            {step.naturalLanguage}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
              >
                {/* Empty State Icon */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                    <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                {/* Empty State Text */}
                <h4 className="text-base font-semibold text-gray-900 font-futura mb-2">
                  Your workflow will appear here
                </h4>
                <p className="text-sm text-gray-500 font-futura leading-relaxed">
                  Watch as your automation builds step by step based on your requirements
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
    </div>
  );
}
