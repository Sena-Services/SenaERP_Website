"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ColumnRef {
  tableIdx: number;
  colIdx: number;
  element: HTMLDivElement | null;
}

export default function DataBuilderDemo() {
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

      // Stage 0: Show user query only (500ms)
      // Stage 1: Show skeleton tables (600ms)
      // Stage 2: Tables fill with color (600ms)
      // Stage 3: Columns appear (1000ms)
      // Stage 4: Relationship lines draw (800ms) - THE STAR! (faster)
      // Stage 5: Validations appear (400ms) - faster
      // Stage 6: Endpoints appear (400ms) - faster
      // Stage 7: Permissions appear (600ms)
      // Stage 8: Hold (3500ms) - Same as UI builder hold time
      // Stage 9: Fade out (800ms) - SLOWER FADE

      const stages = [500, 600, 600, 1000, 800, 400, 400, 600, 3500];
      let currentStage = 0;

      const progressStages = () => {
        if (currentStage < stages.length) {
          setTimeout(() => {
            currentStage++;
            setStage(currentStage);
            progressStages();
          }, stages[currentStage] || 500);
        } else {
          // Hold completed, now reset and fade out
          // First reset stage to 0 (skeleton state)
          setStage(0);
          // Then fade out
          setTimeout(() => {
            setFadeOut(true);
            // Finally switch example after fade
            setTimeout(() => {
              setCurrentExample((prev) => (prev + 1) % examples.length);
            }, 600);
          }, 200);
        }
      };

      // Start the sequence
      progressStages();
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
    <div className="flex flex-col h-[600px] bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden p-8">
      {/* Request badge - appears first in stage 0 */}
      {stage >= 0 && (
        <div className="text-center mb-8 flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExample}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: fadeOut ? 0 : 1, y: fadeOut ? 20 : 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
              className="inline-block bg-white px-6 py-3 rounded-full shadow-md border border-gray-200"
            >
              <p className="text-sm font-futura text-gray-700">
                "{currentData.request}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Main content area */}
      <motion.div
        animate={{ opacity: fadeOut ? 0 : 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col space-y-6"
      >
        {/* Tables row with SVG overlay for relationship lines */}
        <div ref={containerRef} className="relative flex-shrink-0">
          <div className="flex justify-center gap-12 relative">
            {currentData.tables.map((table, tableIdx) => (
              <motion.div
                key={tableIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: stage >= 1 ? 1 : 0,
                  scale: stage >= 1 ? 1 : 0.9
                }}
                transition={{ delay: tableIdx * 0.12, duration: 0.4, type: "spring", stiffness: 200 }}
                className={`rounded-lg shadow-md border p-4 w-56 relative transition-all duration-500 ${
                  stage >= 2
                    ? "bg-white border-gray-200"
                    : "bg-gray-100 border-gray-300"
                }`}
              >
                {/* Table name */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b transition-colors duration-500" style={{
                  borderColor: stage >= 2 ? "rgb(229, 231, 235)" : "rgb(209, 213, 219)"
                }}>
                  <motion.div
                    animate={{
                      backgroundColor: stage >= 2 ? "#3b82f6" : "#9ca3af"
                    }}
                    transition={{ duration: 0.5 }}
                    className="w-2 h-2 rounded-full"
                  />
                  <motion.h4
                    animate={{
                      color: stage >= 2 ? "#111827" : "#6b7280"
                    }}
                    transition={{ duration: 0.5 }}
                    className="font-futura font-bold text-sm"
                  >
                    {table.name}
                  </motion.h4>
                </div>

                {/* Columns */}
                <div className="space-y-1.5">
                  {table.columns.map((col, colIdx) => (
                    <motion.div
                      key={colIdx}
                      ref={(el) => { columnRefs.current[`${tableIdx}-${colIdx}`] = el; }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: stage >= 3 ? 1 : 0,
                        x: stage >= 3 ? 0 : -10
                      }}
                      transition={{ delay: 0.1 + colIdx * 0.06, duration: 0.3 }}
                      className="flex items-center gap-2"
                    >
                      <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className={`text-xs font-futura ${col.includes('FK') ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}>
                        {col}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* SVG overlay for relationship lines - THE STAR OF THE SHOW */}
          {stage >= 4 && containerRef.current && (
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
                  <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
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
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{
                        delay: idx * 0.5,
                        duration: 1,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Dots at connection points */}
                    <motion.circle
                      cx={fromX}
                      cy={fromY}
                      r="4"
                      fill="#3b82f6"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: idx * 0.5 + 0.2,
                        duration: 0.3
                      }}
                    />
                    <motion.circle
                      cx={toX}
                      cy={toY}
                      r="4"
                      fill="#3b82f6"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: idx * 0.5 + 0.8,
                        duration: 0.3
                      }}
                    />

                    {/* Relationship type badge on line */}
                    <motion.g
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: idx * 0.5 + 0.6,
                        duration: 0.3,
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
                        fill="#3b82f6"
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

        {/* Bottom row: Validations, Endpoints, Permissions */}
        <div className="grid grid-cols-3 gap-4">
          {/* Validations */}
          {stage >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h5 className="font-futura font-bold text-xs text-gray-900 uppercase tracking-wide">
                  Validation Rules
                </h5>
              </div>
              <div className="space-y-2">
                {currentData.validations.map((validation, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-green-600 text-xs mt-0.5">✓</span>
                    <span className="text-xs font-futura text-gray-600">{validation}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* API Endpoints */}
          {stage >= 6 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-waygent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h5 className="font-futura font-bold text-xs text-gray-900 uppercase tracking-wide">
                  API Endpoints
                </h5>
              </div>
              <div className="space-y-2">
                {currentData.endpoints.map((endpoint, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="font-mono text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
                  >
                    {endpoint}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Permissions */}
          {stage >= 7 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h5 className="font-futura font-bold text-xs text-gray-900 uppercase tracking-wide">
                  Permissions
                </h5>
              </div>
              <div className="space-y-2">
                {currentData.permissions.map((permission, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.3 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-purple-600 text-xs mt-0.5">🔒</span>
                    <span className="text-xs font-futura text-gray-600">{permission}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
