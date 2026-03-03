"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ColumnRef {
  tableIdx: number;
  colIdx: number;
  element: HTMLDivElement | null;
}

export default function DataBuilderDemo() {
  // Add style to hide scrollbars
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [currentExample, setCurrentExample] = useState(0);
  const [stage, setStage] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const columnRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const examples = [
    {
      request: "Set up CRM with customers, orders, and products",
      tables: [
        {
          name: "Customers",
          columns: ["ID", "Name", "Email", "Phone", "Created"]
        },
        {
          name: "Orders",
          columns: ["ID", "Customer (FK)", "Total", "Status", "Date"]
        },
        {
          name: "Products",
          columns: ["ID", "Name", "Price", "Stock", "Category"]
        }
      ],
      relationships: [
        {
          fromTable: 0,
          fromCol: 0, // ID in Customers
          toTable: 1,
          toCol: 1, // Customer (FK) in Orders
          type: "1:N"
        },
        {
          fromTable: 1,
          fromCol: 0, // ID in Orders
          toTable: 2,
          toCol: 0, // Products would have Order (FK) but showing connection
          type: "N:M"
        }
      ],
      validations: [
        "Email format validation",
        "Required field checks",
        "Price must be positive"
      ],
      endpoints: [
        "GET /api/customers",
        "POST /api/orders",
        "GET /api/products"
      ],
      permissions: [
        "Admin: Full access",
        "Sales: Read/Write orders",
        "User: Read only"
      ]
    },
    {
      request: "Create inventory system with warehouses and shipments",
      tables: [
        {
          name: "Warehouses",
          columns: ["ID", "Name", "Location", "Capacity", "Manager"]
        },
        {
          name: "Inventory",
          columns: ["ID", "Warehouse (FK)", "Product", "Quantity", "Updated"]
        },
        {
          name: "Shipments",
          columns: ["ID", "From (FK)", "To (FK)", "Status", "Date"]
        }
      ],
      relationships: [
        {
          fromTable: 0,
          fromCol: 0, // ID in Warehouses
          toTable: 1,
          toCol: 1, // Warehouse (FK) in Inventory
          type: "1:N"
        },
        {
          fromTable: 0,
          fromCol: 0, // ID in Warehouses
          toTable: 2,
          toCol: 1, // From (FK) in Shipments
          type: "1:N"
        }
      ],
      validations: [
        "Quantity cannot be negative",
        "Location coordinates valid",
        "Capacity limits enforced"
      ],
      endpoints: [
        "GET /api/warehouses",
        "POST /api/inventory",
        "PUT /api/shipments/:id"
      ],
      permissions: [
        "Admin: Full access",
        "Warehouse: Manage inventory",
        "Viewer: Read only"
      ]
    },
    {
      request: "Build HR system with employees, departments, and payroll",
      tables: [
        {
          name: "Employees",
          columns: ["ID", "Name", "Email", "Dept (FK)", "Hire Date"]
        },
        {
          name: "Departments",
          columns: ["ID", "Name", "Manager (FK)", "Budget", "Location"]
        },
        {
          name: "Payroll",
          columns: ["ID", "Employee (FK)", "Amount", "Period", "Status"]
        }
      ],
      relationships: [
        {
          fromTable: 1,
          fromCol: 0, // ID in Departments
          toTable: 0,
          toCol: 3, // Dept (FK) in Employees
          type: "1:N"
        },
        {
          fromTable: 0,
          fromCol: 0, // ID in Employees
          toTable: 2,
          toCol: 1, // Employee (FK) in Payroll
          type: "1:N"
        }
      ],
      validations: [
        "Email uniqueness check",
        "Hire date not in future",
        "Salary within budget"
      ],
      endpoints: [
        "GET /api/employees",
        "POST /api/departments",
        "GET /api/payroll"
      ],
      permissions: [
        "Admin: Full access",
        "HR: Manage employees",
        "Employee: View own data"
      ]
    }
  ];

  const currentData = examples[currentExample];

  useEffect(() => {
    const runSequence = () => {
      // Reset everything immediately to skeleton state
      setStage(0);
      setFadeOut(false);

      // Stage 0: Show user query only (600ms)
      // Stage 1: Show white tables with gray content placeholders (700ms)
      // Stage 2: Columns fill in with actual data (900ms)
      // Stage 3: Relationship lines draw (1200ms) - THE STAR!
      // Stage 4: Validations appear (600ms)
      // Stage 5: Endpoints appear (600ms)
      // Stage 6: Permissions appear (700ms)
      // Stage 7: Hold (5000ms) - Longer hold time
      // Stage 8: Fade out (800ms)

      const stages = [600, 700, 900, 1200, 600, 600, 700, 5000];
      let currentStage = 0;

      const progressStages = () => {
        if (currentStage < stages.length) {
          setTimeout(() => {
            currentStage++;
            setStage(currentStage);
            progressStages();
          }, stages[currentStage] || 500);
        } else {
          // Hold completed, now fade out and switch
          setTimeout(() => {
            setFadeOut(true);
            // After fade completes, switch example (which will reset stage to 0)
            setTimeout(() => {
              setCurrentExample((prev) => (prev + 1) % examples.length);
            }, 600);
          }, 100);
        }
      };

      // Start the sequence after a brief delay to let stage 0 render
      setTimeout(() => {
        progressStages();
      }, 100);
    };

    runSequence();
  }, [currentExample]);

  // Calculate line path between two specific column rows
  const getLinePathBetweenColumns = (fromTable: number, fromCol: number, toTable: number, toCol: number) => {
    const fromKey = `${fromTable}-${fromCol}`;
    const toKey = `${toTable}-${toCol}`;

    const fromElement = columnRefs.current[fromKey];
    const toElement = columnRefs.current[toKey];
    const container = containerRef.current;

    if (!fromElement || !toElement || !container) {
      return { path: "", midX: 0, midY: 0 };
    }

    const fromRect = fromElement.getBoundingClientRect();
    const toRect = toElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Calculate positions relative to container
    // From: right edge of the source column row
    const fromX = fromRect.right - containerRect.left;
    const fromY = fromRect.top - containerRect.top + fromRect.height / 2;

    // To: left edge of the target column row
    const toX = toRect.left - containerRect.left;
    const toY = toRect.top - containerRect.top + toRect.height / 2;

    // Create smooth bezier curve that arcs above or below to avoid middle tables
    const controlPointOffset = Math.abs(toX - fromX) * 0.5;

    // Arc upward if line goes left to right, downward if going backwards
    const verticalOffset = fromX < toX ? -50 : 50; // Negative = up, Positive = down

    const controlX1 = fromX + controlPointOffset * 0.4;
    const controlY1 = fromY + verticalOffset;
    const controlX2 = toX - controlPointOffset * 0.4;
    const controlY2 = toY + verticalOffset;

    const path = `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;
    const midX = (fromX + toX) / 2;
    const midY = (fromY + toY) / 2;

    return { path, midX, midY, fromX, fromY, toX, toY };
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden p-2 md:p-4" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      backgroundColor: '#FAFAF8'
    }}>
      {/* Request badge - appears first in stage 0 */}
      {stage >= 0 && !fadeOut && (
        <div className="text-center mb-2 md:mb-4 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExample}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="inline-block bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full shadow-md border border-gray-200"
            >
              <p className="text-[10px] md:text-xs font-futura text-gray-700">
                "{currentData.request}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Main content area */}
      {!fadeOut && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 flex flex-col space-y-2 md:space-y-3 overflow-y-auto hide-scrollbar"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Tables row with SVG overlay for relationship lines */}
          {stage >= 1 && (
          <div ref={containerRef} className="relative flex-shrink-0">
            <div className="flex justify-start md:justify-center gap-2 md:gap-6 relative overflow-x-auto hide-scrollbar pb-2 px-2 md:px-0" style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}>
              {currentData.tables.map((table, tableIdx) => (
                <motion.div
                  key={tableIdx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: tableIdx * 0.12, duration: 0.4, type: "spring", stiffness: 200 }}
                  className="rounded-lg shadow-md border-2 border-[#8FB7C5] bg-white p-1.5 md:p-2 w-32 md:w-48 relative flex-shrink-0"
                >
                {/* Table name */}
                <div className="flex items-center gap-1 mb-1 pb-1 border-b border-gray-200">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#8FB7C5]" />
                  <h4 className="font-futura font-bold text-[10px] md:text-xs text-gray-900 truncate">
                    {table.name}
                  </h4>
                </div>

                {/* Columns */}
                <div className="space-y-0.5 md:space-y-1">
                  {table.columns.map((col, colIdx) => (
                    <motion.div
                      key={colIdx}
                      ref={(el) => { columnRefs.current[`${tableIdx}-${colIdx}`] = el; }}
                      className="flex items-center gap-0.5 md:gap-1"
                    >
                      <svg className="hidden md:block w-2 h-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="w-0.5 h-0.5 rounded-full bg-emerald-400 md:hidden flex-shrink-0" />
                      {stage >= 2 ? (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: colIdx * 0.06, duration: 0.3 }}
                          className={`text-[9px] md:text-[10px] font-futura truncate ${col.includes('FK') ? 'text-emerald-600 font-semibold' : 'text-gray-600'}`}
                        >
                          {col}
                        </motion.span>
                      ) : (
                        <div className="flex items-center gap-0.5">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-emerald-400 rounded-full"
                              animate={{
                                height: [4, 8, 4],
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
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* SVG overlay for relationship lines - THE STAR OF THE SHOW */}
          {stage >= 3 && containerRef.current && (
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{
                width: "100%",
                height: "100%",
                overflow: "visible"
              }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#6BA3B5" />
                </marker>
              </defs>

              {currentData.relationships.map((rel, idx) => {
                const { path, midX, midY, fromX, fromY, toX, toY } = getLinePathBetweenColumns(
                  rel.fromTable,
                  rel.fromCol,
                  rel.toTable,
                  rel.toCol
                );

                if (!path) return null;

                return (
                  <g key={idx}>
                    {/* Animated line path with arrow */}
                    <motion.path
                      d={path}
                      fill="none"
                      stroke="#6BA3B5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        delay: idx * 0.6,
                        duration: 1.2,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Dots at connection points */}
                    <motion.circle
                      cx={fromX}
                      cy={fromY}
                      r="5"
                      fill="#8FB7C5"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: idx * 0.6 + 0.2,
                        duration: 0.4
                      }}
                    />
                    <motion.circle
                      cx={toX}
                      cy={toY}
                      r="5"
                      fill="#8FB7C5"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: idx * 0.6 + 0.9,
                        duration: 0.4
                      }}
                    />

                    {/* Relationship type badge on line */}
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: idx * 0.6 + 0.7,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      <rect
                        x={midX - 20}
                        y={midY - 10}
                        width="40"
                        height="20"
                        rx="10"
                        fill="#6BA3B5"
                      />
                      <text
                        x={midX}
                        y={midY + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                        fontFamily="Futura, sans-serif"
                      >
                        {rel.type}
                      </text>
                    </motion.g>
                  </g>
                );
              })}
            </svg>
          )}
          </div>
        )}

        {/* Bottom row: Validations, Endpoints, Permissions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
          {/* Validations */}
          {stage >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md border-2 border-[#8FB7C5] p-2 md:p-3"
            >
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h5 className="font-futura font-bold text-[10px] md:text-xs text-gray-900 uppercase tracking-wide">
                  Validations
                </h5>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                {currentData.validations.map((validation, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="flex items-start gap-1.5 md:gap-2"
                  >
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[10px] md:text-xs font-futura text-gray-600 leading-tight">{validation}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* API Endpoints */}
          {stage >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md border-2 border-[#8FB7C5] p-2 md:p-3"
            >
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h5 className="font-futura font-bold text-[10px] md:text-xs text-gray-900 uppercase tracking-wide">
                  Endpoints
                </h5>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                {currentData.endpoints.map((endpoint, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="font-mono text-[9px] md:text-xs text-gray-600 bg-gray-50 px-1.5 md:px-2 py-1 rounded truncate"
                  >
                    {endpoint}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Permissions */}
          {stage >= 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-md border-2 border-[#8FB7C5] p-2 md:p-3"
            >
              <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-[#6BA3B5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h5 className="font-futura font-bold text-[10px] md:text-xs text-gray-900 uppercase tracking-wide">
                  Permissions
                </h5>
              </div>
              <div className="space-y-0.5 md:space-y-1">
                {currentData.permissions.map((permission, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="flex items-start gap-1.5 md:gap-2"
                  >
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-[10px] md:text-xs font-futura text-gray-600 leading-tight">{permission}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
        </motion.div>
      )}
    </div>
  );
}
