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
  const [visibleSteps, setVisibleSteps] = useState(0);
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
      setVisibleSteps(0);
      setFadeOut(false);

      // Show steps one by one
      const stepInterval = 1400; // 1.4s per step
      let currentStep = 0;

      const showNextStep = () => {
        if (currentStep < currentData.steps.length) {
          currentStep++;
          setVisibleSteps(currentStep);
          setTimeout(showNextStep, stepInterval);
        } else {
          // All steps shown, hold for 4.5 seconds
          setTimeout(() => {
            // Reset to 0 first
            setVisibleSteps(0);
            setTimeout(() => {
              setFadeOut(true);
              setTimeout(() => {
                setCurrentExample((prev) => (prev + 1) % examples.length);
              }, 600);
            }, 300);
          }, 4500);
        }
      };

      setTimeout(showNextStep, 800);
    };

    runSequence();
  }, [currentExample]);

  return (
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden p-8">
      {/* Request badge at top */}
      <div className="text-center mb-8 flex-shrink-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExample}
            initial={{ opacity: 0 }}
            animate={{ opacity: fadeOut ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block bg-white px-6 py-3 rounded-full shadow-md border border-gray-200"
          >
            <p className="text-sm font-futura text-gray-700">
              "{currentData.request}"
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main content - centered workflow */}
      <motion.div
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex justify-center items-start overflow-hidden"
      >
        <div className="relative max-w-2xl w-full">
          {/* Vertical connecting line */}
          {visibleSteps > 1 && (
            <div className="absolute left-[15px] top-10 bottom-0 w-0.5 bg-gray-300" />
          )}

          {/* Workflow steps */}
          <div className="space-y-3 relative">
            {currentData.steps.slice(0, visibleSteps).map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                className="relative flex items-center"
              >
                {/* Connection dot - centered to card */}
                <div className="absolute left-[13.5px] w-3 h-3 rounded-full bg-green-500 border-2 border-white shadow-sm z-10" />

                {/* Node card */}
                <div className="ml-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1">
                  {/* Technical section - top */}
                  <div className="px-3 py-1.5 border-b border-gray-200">
                    {/* Header */}
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-sm">{step.icon}</span>
                      <h4 className="font-futura font-bold text-[9px] uppercase tracking-wide text-gray-900">
                        {step.title}
                      </h4>
                    </div>

                    {/* Technical details */}
                    <div className="space-y-0.5">
                      {step.technicalDetails.map((detail, detailIdx) => (
                        <div key={detailIdx} className="flex items-start text-[9px]">
                          <span className="font-futura font-semibold text-gray-600 min-w-[65px]">
                            {detail.label}:
                          </span>
                          <span className="font-futura text-gray-800 font-mono text-[9px]">
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Natural language section - bottom */}
                  <div className="px-3 py-1.5 bg-gray-50">
                    <p className="text-[9px] font-futura text-gray-600 leading-snug">
                      {step.naturalLanguage}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
