"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type MobileDataBuilderDemoProps = {
  isVisible?: boolean;
};

export default function MobileDataBuilderDemo({ isVisible = true }: MobileDataBuilderDemoProps) {
  const [currentExample, setCurrentExample] = useState(0);
  const [phase, setPhase] = useState<"chat" | "preview">("chat");
  const [showUserMessage, setShowUserMessage] = useState(false);
  const [buildingStage, setBuildingStage] = useState(0);
  const [showFinalResponse, setShowFinalResponse] = useState(false);
  const [aiResponseText, setAiResponseText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [visibleTables, setVisibleTables] = useState(0);

  const examples = [
    {
      userMessage: "Set up CRM with customers, orders, and products",
      buildingSteps: [
        "Creating schema...",
        "Setting up tables...",
        "Adding relationships..."
      ],
      aiResponse: "Perfect! Your CRM database is ready with six interconnected tables. The system tracks customers, their orders, products, payments, shipping, and reviews - all properly linked with foreign keys for complete data integrity.",
      tables: [
        // Row 1
        { name: "Customers", columns: ["ID", "Name", "Email"], row: 0, col: 0 },
        { name: "Orders", columns: ["ID", "Customer", "Total"], row: 0, col: 1 },
        { name: "Products", columns: ["ID", "Name", "Price"], row: 0, col: 2 },
        // Row 2
        { name: "Payments", columns: ["ID", "Order", "Amount"], row: 1, col: 0 },
        { name: "Shipping", columns: ["ID", "Order", "Address"], row: 1, col: 1 },
        { name: "Reviews", columns: ["ID", "Product", "Rating"], row: 1, col: 2 }
      ],
      relationships: [
        // Horizontal connections
        { from: 0, to: 1, label: "1:N", type: "horizontal" },
        { from: 1, to: 2, label: "N:M", type: "horizontal" },
        // Vertical connections
        { from: 1, to: 3, label: "1:N", type: "vertical" },
        { from: 1, to: 4, label: "1:1", type: "vertical" },
        { from: 2, to: 5, label: "1:N", type: "vertical" }
      ]
    },
    {
      userMessage: "Create inventory system with warehouses and shipments",
      buildingSteps: [
        "Creating schema...",
        "Setting up tables...",
        "Adding relationships..."
      ],
      aiResponse: "Done! Your inventory system is ready to track stock across multiple locations. The complete system manages warehouses, inventory levels, suppliers, shipments, stock adjustments, and audit logs for full traceability.",
      tables: [
        // Row 1
        { name: "Warehouses", columns: ["ID", "Name", "Location"], row: 0, col: 0 },
        { name: "Inventory", columns: ["ID", "Warehouse", "Qty"], row: 0, col: 1 },
        { name: "Suppliers", columns: ["ID", "Name", "Contact"], row: 0, col: 2 },
        // Row 2
        { name: "Shipments", columns: ["ID", "From", "To"], row: 1, col: 0 },
        { name: "Adjustments", columns: ["ID", "Item", "Change"], row: 1, col: 1 },
        { name: "Audit Log", columns: ["ID", "Action", "Date"], row: 1, col: 2 }
      ],
      relationships: [
        { from: 0, to: 1, label: "1:N", type: "horizontal" },
        { from: 1, to: 2, label: "N:1", type: "horizontal" },
        { from: 0, to: 3, label: "1:N", type: "vertical" },
        { from: 1, to: 4, label: "1:N", type: "vertical" },
        { from: 1, to: 5, label: "1:N", type: "vertical" }
      ]
    },
    {
      userMessage: "Build employee management with departments and payroll",
      buildingSteps: [
        "Creating schema...",
        "Setting up tables...",
        "Adding relationships..."
      ],
      aiResponse: "All set! Your HR system is ready. The complete solution manages employees, departments, payroll, attendance tracking, benefits, and performance reviews - all interconnected for comprehensive workforce management.",
      tables: [
        // Row 1
        { name: "Employees", columns: ["ID", "Name", "Dept"], row: 0, col: 0 },
        { name: "Departments", columns: ["ID", "Name", "Manager"], row: 0, col: 1 },
        { name: "Payroll", columns: ["ID", "Employee", "Salary"], row: 0, col: 2 },
        // Row 2
        { name: "Attendance", columns: ["ID", "Employee", "Date"], row: 1, col: 0 },
        { name: "Benefits", columns: ["ID", "Employee", "Type"], row: 1, col: 1 },
        { name: "Reviews", columns: ["ID", "Employee", "Score"], row: 1, col: 2 }
      ],
      relationships: [
        { from: 0, to: 1, label: "N:1", type: "horizontal" },
        { from: 0, to: 2, label: "1:N", type: "horizontal" },
        { from: 0, to: 3, label: "1:N", type: "vertical" },
        { from: 0, to: 4, label: "1:N", type: "vertical" },
        { from: 0, to: 5, label: "1:N", type: "vertical" }
      ]
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
      setVisibleTables(0);
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
      setVisibleTables(0);

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
              // Show tables one by one in preview
              let table = 0;
              const showTables = () => {
                if (table < currentExampleData.tables.length) {
                  timeouts.push(setTimeout(() => {
                    table++;
                    setVisibleTables(table);
                    showTables();
                  }, 400));
                }
              };
              showTables();

              // 5. Show preview for a bit, then reset and move to next
              timeouts.push(setTimeout(() => {
                setPhase("chat");
                setShowUserMessage(false);
                setBuildingStage(0);
                setShowFinalResponse(false);
                setAiResponseText("");
                setShowCursor(true);
                setVisibleTables(0);

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
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col bg-white"
            >
              {/* Chat Header */}
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">Data Builder</h3>
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
                    placeholder="Describe your data structure..."
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
            // PREVIEW PHASE - Database tables
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
                <span className="text-xs text-gray-500 font-mono ml-1">Database Schema</span>
              </div>

              {/* Database Schema with Tables and Relationships */}
              <div className="p-2" style={{ height: 'calc(420px - 38px)', overflow: 'hidden' }}>
                <div className="h-full flex items-center justify-center">
                  <div className="relative w-full">
                    {/* Row 1 - Top 3 tables */}
                    <div className="flex justify-between items-start gap-2 mb-12">
                      {currentExampleData.tables.slice(0, Math.min(3, visibleTables)).map((table, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className="flex-1 bg-white border-2 border-blue-200 rounded-lg p-1.5 shadow-sm"
                        >
                          <h4 className="text-[10px] font-bold text-blue-600 mb-1 text-center">{table.name}</h4>
                          <div className="space-y-0.5">
                            {table.columns.map((col, colIdx) => (
                              <div key={colIdx} className="text-[8px] text-gray-700 px-1 py-0.5 bg-gray-50 rounded">
                                • {col}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Row 2 - Bottom 3 tables */}
                    {visibleTables > 3 && (
                      <div className="flex justify-between items-start gap-2">
                        {currentExampleData.tables.slice(3, visibleTables).map((table, idx) => (
                          <motion.div
                            key={idx + 3}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className="flex-1 bg-white border-2 border-blue-200 rounded-lg p-1.5 shadow-sm"
                          >
                            <h4 className="text-[10px] font-bold text-blue-600 mb-1 text-center">{table.name}</h4>
                            <div className="space-y-0.5">
                              {table.columns.map((col, colIdx) => (
                                <div key={colIdx} className="text-[8px] text-gray-700 px-1 py-0.5 bg-gray-50 rounded">
                                  • {col}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Relationship arrows */}
                    {visibleTables >= 2 && currentExampleData.relationships.map((rel, idx) => {
                      if (rel.from >= visibleTables || rel.to >= visibleTables) return null;

                      const fromTable = currentExampleData.tables[rel.from];
                      const toTable = currentExampleData.tables[rel.to];

                      if (rel.type === "horizontal") {
                        // Horizontal arrow (same row)
                        const rowOffset = fromTable.row * 120; // Adjust based on row
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="absolute"
                            style={{
                              top: `${40 + rowOffset}px`,
                              left: `${(fromTable.col + 0.85) * 33.33}%`,
                              width: `${(toTable.col - fromTable.col - 0.7) * 33.33}%`,
                            }}
                          >
                            <div className="relative h-6 flex items-center">
                              <div className="absolute w-full h-0.5 bg-green-400" style={{ top: '50%' }} />
                              <div className="absolute right-0 w-2 h-2 border-t-2 border-r-2 border-green-400 transform rotate-45" style={{ top: 'calc(50% - 4px)' }} />
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 bg-white px-1 py-0.5 rounded text-[8px] font-bold text-green-600 border border-green-300">
                                {rel.label}
                              </div>
                            </div>
                          </motion.div>
                        );
                      } else {
                        // Vertical arrow (cross rows)
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="absolute"
                            style={{
                              top: '75px',
                              left: `${fromTable.col * 33.33 + 16.66}%`,
                              height: '45px',
                            }}
                          >
                            <div className="relative w-6 h-full flex items-center justify-center">
                              <div className="absolute w-0.5 h-full bg-purple-400" style={{ left: '50%' }} />
                              <div className="absolute bottom-0 left-1/2 w-2 h-2 border-b-2 border-r-2 border-purple-400 transform rotate-45 -translate-x-1/2" />
                              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-1 py-0.5 rounded text-[8px] font-bold text-purple-600 border border-purple-300 whitespace-nowrap">
                                {rel.label}
                              </div>
                            </div>
                          </motion.div>
                        );
                      }
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
