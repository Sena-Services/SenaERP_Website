"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { useIsMobile } from "@/hooks/useIsMobile";

// SVG Icon components for workflow steps
const WorkflowIcons = {
  trigger: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  read: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  slack: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  task: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  ),
  condition: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  email: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  pause: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  calculate: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  purchase: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
};

export default function WorkflowsBuilderDemo() {
  const [currentExample, setCurrentExample] = useState(0);
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const isMobile = useIsMobile();
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [, forceUpdate] = useState({});
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Helper to track timeouts for cleanup
  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  // Force re-render when cards are mounted to calculate line heights
  useEffect(() => {
    if (visibleSteps > 0) {
      const timer = setTimeout(() => {
        forceUpdate({});
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps]);

  const examples = [
    {
      request: "When a new lead submits the form, send notification to Slack and create task",
      steps: [
        {
          iconType: "trigger" as const,
          title: "TRIGGER",
          technicalDetails: [
            { label: "Event", value: "onCreate" },
            { label: "DocType", value: "Lead" },
            { label: "Timing", value: "Immediate" }
          ],
          naturalLanguage: "This workflow is triggered automatically when a new Contact record is created. Specifically, it runs immediately after a new contact is inserted into the system."
        },
        {
          iconType: "read" as const,
          title: "READ DATA",
          technicalDetails: [
            { label: "Data", value: "Lead" },
            { label: "Fields", value: "name, email, company" },
            { label: "Output", value: "lead_data" }
          ],
          naturalLanguage: "The workflow begins by logging a message to the console indicating the start of the process. This message includes the first name and last name of the newly created contact, providing an audit trail of the workflow's initiation."
        },
        {
          iconType: "slack" as const,
          title: "SLACK NOTIFICATION",
          technicalDetails: [
            { label: "Channel", value: "#sales" },
            { label: "Message", value: "New lead: {{name}}" },
            { label: "Include", value: "Form link + details" }
          ],
          naturalLanguage: "The workflow retrieves the Administrator user account and saves it for later use. This allows the workflow to access the name, email, and full name of the Administrator, enabling subsequent actions to use this information."
        },
        {
          iconType: "task" as const,
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
          iconType: "trigger" as const,
          title: "TRIGGER",
          technicalDetails: [
            { label: "Event", value: "onCreate/onUpdate" },
            { label: "DocType", value: "Order" },
            { label: "Monitor", value: "total field" }
          ],
          naturalLanguage: "This workflow triggers when a new Order is created or updated. It monitors order values in real-time to enforce approval policies for high-value transactions."
        },
        {
          iconType: "condition" as const,
          title: "CONDITION",
          technicalDetails: [
            { label: "Field", value: "order.total" },
            { label: "Operator", value: ">" },
            { label: "Value", value: "$1000" }
          ],
          naturalLanguage: "Check if the order total is greater than $1000 to determine if manager approval is required. This ensures proper oversight for significant purchases."
        },
        {
          iconType: "email" as const,
          title: "APPROVAL REQUEST",
          technicalDetails: [
            { label: "To", value: "Manager" },
            { label: "Type", value: "Approval Required" },
            { label: "Actions", value: "Approve / Reject" }
          ],
          naturalLanguage: "Send approval request email to the manager with complete order details and approve/reject action buttons for quick decision-making."
        },
        {
          iconType: "pause" as const,
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
          iconType: "trigger" as const,
          title: "TRIGGER",
          technicalDetails: [
            { label: "Event", value: "onUpdate" },
            { label: "DocType", value: "Inventory" },
            { label: "Monitor", value: "quantity field" }
          ],
          naturalLanguage: "This workflow monitors inventory levels continuously and triggers automatically when stock quantity falls below the reorder threshold of 10 units."
        },
        {
          iconType: "condition" as const,
          title: "CONDITION",
          technicalDetails: [
            { label: "Field", value: "inventory.quantity" },
            { label: "Operator", value: "<" },
            { label: "Value", value: "10" }
          ],
          naturalLanguage: "Check if the current stock level is below 10 units to trigger the automated reorder process and prevent stockouts."
        },
        {
          iconType: "calculate" as const,
          title: "CALCULATE",
          technicalDetails: [
            { label: "Input", value: "Sales history" },
            { label: "Formula", value: "avg_daily × lead_time × 2" },
            { label: "Output", value: "reorder_qty" }
          ],
          naturalLanguage: "Calculate optimal reorder quantity based on historical sales data and supplier lead time. The formula accounts for average daily usage multiplied by delivery time with a safety buffer."
        },
        {
          iconType: "purchase" as const,
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
    // Clear any pending timeouts from the previous cycle
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const runSequence = () => {
      // Reset state
      setFadeOut(false);
      setShowUserMessage(false);
      setVisibleSteps(0);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowCursor(true);
      setShowPreview(false);

      // Show user message first with delay (matching UI builder)
      safeTimeout(() => {
        setShowUserMessage(true);
      }, 200);

      // Show steps one by one with building messages
      const stepInterval = 800; // 0.8s per step (slower, more deliberate)
      let currentStep = 0;

      const showNextStep = () => {
        if (currentStep < currentData.steps.length) {
          // Update building stage message
          setBuildingStage(currentStep + 1);
          // Show the actual node
          safeTimeout(() => {
            currentStep++;
            setVisibleSteps(currentStep);
            safeTimeout(showNextStep, stepInterval);
          }, 150);
        } else {
          // All steps shown, show final response
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

      // Start showing steps after user message appears
      safeTimeout(showNextStep, 500);
    };

    runSequence();

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [currentExample, safeTimeout]);

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
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden md:rounded-2xl" style={{ backgroundColor: '#FAFAF8' }}>
      {/* Left Side - Chat Container */}
      <motion.div
        className={`w-full md:w-[35%] flex items-stretch p-2 md:p-3 h-full max-h-full ${
          isMobile && showPreview ? 'hidden' : ''
        }`}
        animate={{ opacity: isMobile && showPreview ? 0 : (fadeOut ? 0 : 1) }}
        transition={{ duration: 0.5 }}
      >
          {/* Builder Chat Box - Full height */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 w-full flex flex-col overflow-hidden h-full" style={{
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 4px 15px -5px rgba(0, 0, 0, 0.05)'
          }}>
            {/* Chat Header */}
            <div className="px-2.5 py-2 bg-[#F5F1E8] border-b border-[#9CA3AF]/30 rounded-t-xl flex-shrink-0">
              <h3 className="text-xs font-bold text-gray-900 font-futura uppercase tracking-wide">WORKFLOWS BUILDER</h3>
              <p className="text-[10px] text-gray-500 font-futura mt-0.5">Automate any business process</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-2 overflow-hidden p-3">
              {/* User Message - Animates in */}
              {showUserMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-end"
                >
                  <div className="bg-white border border-gray-200 text-gray-900 px-2.5 py-1.5 rounded-lg max-w-[90%] text-[11px] font-futura shadow-sm leading-snug">
                    {currentData.request}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-gray-400 font-futura">
                    <span>Oct 21, 10:00 AM</span>
                    <svg className="w-2.5 h-2.5 hover:text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </motion.div>
              )}

              {/* Building Progress Steps */}
              {buildingStage > 0 && (
                <div className="space-y-1 mt-2">
                  {currentData.steps.slice(0, buildingStage).map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-1.5 text-[10px] font-futura"
                    >
                      {!showFinalResponse && index === buildingStage - 1 ? (
                        <>
                          <div className="flex gap-0.5">
                            <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                          <span className="text-[#6BA3B5]">Creating {step.title} node...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
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
                  className="text-[11px] font-futura text-gray-700 leading-snug mt-1.5"
                >
                  {aiResponseText}
                  {showCursor && aiResponseText.length < 140 && (
                    <span className="inline-block w-0.5 h-3 bg-gray-900 ml-0.5 animate-pulse" />
                  )}
                </motion.div>
              )}
            </div>

            {/* Input Area - Disabled/Empty state */}
            <div className="relative px-2.5 pb-2.5 pt-0 flex-shrink-0">
              <input
                type="text"
                placeholder="Describe your workflow..."
                className="w-full px-2.5 py-1.5 pr-8 rounded-lg bg-[#F5F1E8]/50 border border-[#9CA3AF]/50 text-[11px] text-gray-500 font-futura focus:outline-none focus:border-[#8FB7C5] transition-colors"
                disabled
              />
              <button className="absolute right-3.5 top-1.5 text-[#8FB7C5]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

      {/* Right Side - Workflow Nodes */}
      <motion.div
        className={`w-full md:w-[65%] flex items-center justify-center p-2 md:p-3 md:pl-0 h-full max-h-full ${
          isMobile && !showPreview ? 'hidden' : ''
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: (isMobile && showPreview) || !isMobile ? (fadeOut ? 0 : 1) : 0 }}
        transition={{ duration: 0.5 }}
      >
          <div className="relative max-w-2xl w-full h-full flex items-center justify-center overflow-hidden px-4">
            {visibleSteps > 0 ? (
              <div className="w-full relative">
                {/* Steps container */}
                <div className="space-y-4">
                  {currentData.steps.slice(0, visibleSteps).map((step, idx) => {
                    // Calculate the line height for THIS step
                    const currentCard = cardRefs.current[idx];
                    const nextCard = cardRefs.current[idx + 1];
                    let lineHeight = '16px'; // Default gap-4

                    if (currentCard && nextCard) {
                      // Calculate actual distance from this dot center to next dot center
                      const currentCardHeight = currentCard.offsetHeight;
                      const gapBetweenCards = 16; // space-y-4 = 16px
                      // Line goes from center of this dot (12px from top) to center of next dot
                      lineHeight = `${currentCardHeight - 12 + gapBetweenCards + 12}px`;
                    }

                    return (
                      <motion.div
                        key={idx}
                        ref={(el) => { cardRefs.current[idx] = el; }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                        className="relative flex items-start gap-3 pl-5"
                      >
                        {/* Connection dot - absolutely positioned to align perfectly */}
                        <motion.div
                          className="absolute left-0 w-3.5 h-3.5 rounded-full bg-[#8FB7C5] border-2 border-white shadow-md z-10"
                          style={{
                            top: '14px', // Fixed position from top of card
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                        />

                        {/* Vertical line connecting this dot to next dot */}
                        {idx < visibleSteps - 1 && (
                          <motion.div
                            className="absolute left-[6px] w-0.5 bg-[#8FB7C5]/40 z-0"
                            style={{
                              top: '22px', // Start from center of dot
                            }}
                            initial={{ height: 0 }}
                            animate={{
                              height: lineHeight
                            }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                          />
                        )}

                        {/* Node card */}
                        <div className="bg-white rounded-lg shadow-md border border-[#9CA3AF] overflow-hidden w-full"
                        >
                        {/* Technical section - top */}
                        <div className="px-2 py-1.5 border-b border-gray-200 bg-gradient-to-r from-[#F5F1E8]/50 to-white">
                          {/* Header */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <div className="w-5 h-5 rounded bg-[#8FB7C5] flex items-center justify-center text-white">
                              {WorkflowIcons[step.iconType]}
                            </div>
                            <h4 className="font-futura font-bold text-[9px] uppercase tracking-wide text-gray-900">
                              {step.title}
                            </h4>
                          </div>

                          {/* Technical details */}
                          <div className="space-y-0.5 mt-0.5">
                            {step.technicalDetails.map((detail, detailIdx) => (
                              <div key={detailIdx} className="flex items-center text-[9px]">
                                <span className="font-futura font-semibold text-gray-500 min-w-[55px]">
                                  {detail.label}:
                                </span>
                                <span className="font-futura text-gray-800 font-mono text-[8px] bg-white/60 px-1 py-0.5 rounded">
                                  {detail.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Natural language section - bottom */}
                        <div className="px-2 py-1.5 bg-[#FAFAF8]">
                          <p className="text-[8px] font-futura text-gray-600 leading-relaxed">
                            {step.naturalLanguage}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    );
                  })}
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
                  <div className="w-20 h-20 bg-[#F5F1E8] rounded-xl flex items-center justify-center border border-[#9CA3AF]">
                    <svg className="w-10 h-10 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
