"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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
  const [previewStage, setPreviewStage] = useState(0);

  const examples = [
    {
      userMessage: "Set up CRM with customers, orders, and products",
      buildingSteps: [
        "Creating tables...",
        "Adding columns...",
        "Setting relations...",
        "Adding validations...",
        "Generating APIs..."
      ],
      aiResponse: "Your CRM is ready! 3 tables with relations, validations, and REST APIs configured.",
      tables: [
        { name: "Customers", columns: ["ID", "Name", "Email", "Phone"] },
        { name: "Orders", columns: ["ID", "Customer", "Total", "Status"] },
        { name: "Products", columns: ["ID", "Name", "Price", "Stock"] }
      ],
      validations: ["Email format check", "Price > 0", "Required fields"],
      endpoints: ["GET /customers", "POST /orders", "GET /products"]
    },
    {
      userMessage: "Create inventory system with warehouses and shipments",
      buildingSteps: [
        "Creating tables...",
        "Adding columns...",
        "Setting relations...",
        "Adding validations...",
        "Generating APIs..."
      ],
      aiResponse: "Inventory system ready! Stock tracking across warehouses with shipment history.",
      tables: [
        { name: "Warehouses", columns: ["ID", "Name", "Location", "Capacity"] },
        { name: "Inventory", columns: ["ID", "Product", "Qty", "Updated"] },
        { name: "Shipments", columns: ["ID", "From", "To", "Status"] }
      ],
      validations: ["Qty >= 0", "Valid location", "Capacity limits"],
      endpoints: ["GET /warehouses", "POST /inventory", "PUT /shipments"]
    },
    {
      userMessage: "Build HR system with employees and payroll",
      buildingSteps: [
        "Creating tables...",
        "Adding columns...",
        "Setting relations...",
        "Adding validations...",
        "Generating APIs..."
      ],
      aiResponse: "HR system ready! Employee records, departments, and payroll tracking configured.",
      tables: [
        { name: "Employees", columns: ["ID", "Name", "Email", "Dept"] },
        { name: "Departments", columns: ["ID", "Name", "Manager", "Budget"] },
        { name: "Payroll", columns: ["ID", "Employee", "Amount", "Period"] }
      ],
      validations: ["Unique email", "Valid date", "Budget limits"],
      endpoints: ["GET /employees", "POST /payroll", "GET /departments"]
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
      setPreviewStage(0);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
      setPhase("chat");
      setShowUserMessage(false);
      setBuildingStage(0);
      setShowFinalResponse(false);
      setAiResponseText("");
      setShowCursor(true);
      setPreviewStage(0);

      // Show user message
      timeouts.push(setTimeout(() => setShowUserMessage(true), 600));

      // Progress through building stages (slower)
      let currentStage = 0;
      const progressStages = () => {
        if (currentStage < currentExampleData.buildingSteps.length) {
          timeouts.push(setTimeout(() => {
            currentStage++;
            setBuildingStage(currentStage);
            progressStages();
          }, 800)); // Slower: 800ms per step
        } else {
          // Show AI response
          timeouts.push(setTimeout(() => {
            setShowFinalResponse(true);
            // Switch to preview after response
            timeouts.push(setTimeout(() => {
              setPhase("preview");
              // Animate preview stages
              timeouts.push(setTimeout(() => setPreviewStage(1), 400)); // Tables
              timeouts.push(setTimeout(() => setPreviewStage(2), 1200)); // Validations
              timeouts.push(setTimeout(() => setPreviewStage(3), 2000)); // Endpoints

              // Hold preview for 4 seconds then cycle
              timeouts.push(setTimeout(() => {
                setPhase("chat");
                setShowUserMessage(false);
                setBuildingStage(0);
                setShowFinalResponse(false);
                setAiResponseText("");
                setShowCursor(true);
                setPreviewStage(0);

                timeouts.push(setTimeout(() => {
                  setCurrentExample((prev) => (prev + 1) % examples.length);
                }, 400));
              }, 5000)); // 5 second hold on preview
            }, 2000)); // 2 second hold on final response
          }, 300));
        }
      };

      timeouts.push(setTimeout(() => progressStages(), 800));
    };

    runSequence();

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible, currentExample]);

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
      }, 25);

      return () => clearInterval(typingInterval);
    }
  }, [showFinalResponse, phase, currentExampleData.aiResponse]);

  return (
    <div className="w-full">
      <div
        className="bg-[#F5F1E8]/50 rounded-xl overflow-hidden border border-[#9CA3AF]"
        style={{ height: '280px' }}
      >
        <AnimatePresence mode="wait">
          {phase === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col bg-white"
            >
              {/* Chat Header */}
              <div className="px-3 py-2 bg-[#F5F1E8] border-b border-[#9CA3AF]/30">
                <h3 className="text-[11px] font-bold text-[#374151] uppercase tracking-wide">Data Builder</h3>
                <p className="text-[9px] text-gray-500">Design your database schema</p>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 space-y-2 overflow-hidden">
                <AnimatePresence mode="wait">
                  {showUserMessage && (
                    <motion.div
                      key={`user-${currentExample}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="flex flex-col items-end"
                    >
                      <div className="bg-[#8FB7C5] text-white px-3 py-2 rounded-lg rounded-tr-sm max-w-[90%] text-[11px] leading-relaxed">
                        {currentExampleData.userMessage}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {buildingStage > 0 && (
                  <div className="space-y-1.5">
                    {currentExampleData.buildingSteps.slice(0, buildingStage).map((step, index) => (
                      <motion.div
                        key={`${currentExample}-${index}`}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2 text-[10px] text-gray-600"
                      >
                        {index === buildingStage - 1 && buildingStage < currentExampleData.buildingSteps.length ? (
                          <>
                            <div className="flex gap-0.5">
                              <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                              <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                              <span className="w-1 h-1 bg-[#8FB7C5] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                            <span className="text-[#8FB7C5] font-medium">{step}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 text-[#8FB7C5] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-500">{step}</span>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {showFinalResponse && (
                  <motion.div
                    key={`ai-${currentExample}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-[11px] text-gray-700 leading-relaxed mt-2"
                  >
                    {aiResponseText}
                    {showCursor && <span className="inline-block w-0.5 h-3 bg-[#8FB7C5] ml-0.5 animate-pulse" />}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="h-full bg-white overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#F5F1E8] px-3 py-2 border-b border-[#9CA3AF]/30 flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <span className="text-[10px] text-gray-500 font-medium">Database Schema</span>
              </div>

              {/* Content - No scroll, fixed fit */}
              <div className="p-2.5 flex flex-col overflow-hidden" style={{ height: 'calc(280px - 42px)' }}>
                {/* Tables */}
                {previewStage >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-2"
                  >
                    <div className="text-[8px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tables</div>
                    <div className="flex gap-1.5">
                      {currentExampleData.tables.map((table, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.15, duration: 0.3 }}
                          className="flex-1 bg-[#F5F1E8]/50 border border-[#8FB7C5] rounded-lg overflow-hidden"
                        >
                          <div className="bg-[#8FB7C5] px-1.5 py-0.5">
                            <span className="text-[8px] font-bold text-white">{table.name}</span>
                          </div>
                          <div className="px-1.5 py-1 space-y-0">
                            {table.columns.map((col, colIdx) => (
                              <div key={colIdx} className="text-[7px] text-gray-600 flex items-center gap-0.5 leading-tight">
                                <div className="w-0.5 h-0.5 rounded-full bg-[#8FB7C5]/50 flex-shrink-0" />
                                {col}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Validations & Endpoints Row */}
                {previewStage >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-2 gap-1.5 flex-1"
                  >
                    {/* Validations */}
                    <div className="bg-[#F5F1E8]/30 border border-[#9CA3AF]/30 rounded-lg p-1.5">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-[7px] font-bold text-gray-500 uppercase">Validations</span>
                      </div>
                      <div className="space-y-0.5">
                        {currentExampleData.validations.map((v, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1, duration: 0.2 }}
                            className="flex items-center gap-1 text-[7px] text-gray-600"
                          >
                            <span className="text-green-500 text-[8px]">✓</span>
                            {v}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Endpoints */}
                    {previewStage >= 3 && (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-[#F5F1E8]/30 border border-[#9CA3AF]/30 rounded-lg p-1.5"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <svg className="w-2.5 h-2.5 text-[#8FB7C5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[7px] font-bold text-gray-500 uppercase">Endpoints</span>
                        </div>
                        <div className="space-y-0.5">
                          {currentExampleData.endpoints.map((e, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1, duration: 0.2 }}
                              className="text-[7px] font-mono text-gray-600 bg-white/50 px-1 py-0.5 rounded"
                            >
                              {e}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
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
