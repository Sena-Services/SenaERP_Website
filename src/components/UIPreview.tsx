"use client";

import { motion } from "motion/react";

interface UIPreviewProps {
  buildingStage: number;
  exampleType: "dashboard" | "table" | "form";
}

export default function UIPreview({ buildingStage, exampleType }: UIPreviewProps) {
  const showLayout = buildingStage >= 2;
  const showData = buildingStage >= 3;
  const showDetails = buildingStage >= 4;
  const isComplete = buildingStage >= 5;

  // Render based on example type
  if (exampleType === "table") {
    return renderTable();
  } else if (exampleType === "form") {
    return renderForm();
  } else {
    return renderDashboard();
  }

  function renderDashboard() {
    return (
      <motion.div
        className="w-full h-full flex items-start justify-center pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-md space-y-2">
        {/* Dashboard Title */}
        {showLayout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-2"
          >
            {showData ? (
              <>
                <h3 className="text-sm font-bold text-gray-900 font-futura mb-0.5">Revenue Dashboard</h3>
                <p className="text-xs text-gray-500 font-futura">Building in real-time...</p>
              </>
            ) : (
              <>
                <div className="h-4 bg-gray-200 rounded-md w-32 mx-auto mb-1 animate-pulse" />
                <div className="h-2.5 bg-gray-100 rounded-md w-24 mx-auto animate-pulse" />
              </>
            )}
          </motion.div>
        )}

        {/* Metric Cards */}
        {showLayout && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Revenue", value: "$45.2K", change: "+12.5%" },
              { label: "Orders", value: "1,234", change: "+8.2%" },
              { label: "Users", value: "892", change: "+5.7%" },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white rounded-lg p-2 shadow-sm border border-gray-100"
              >
                {showData ? (
                  <>
                    <p className="text-xs text-gray-500 font-futura mb-0.5">{metric.label}</p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-sm font-bold text-gray-900 font-futura mb-0.5"
                    >
                      {metric.value}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-xs text-green-600 font-semibold font-futura"
                    >
                      {metric.change}
                    </motion.p>
                  </>
                ) : (
                  <>
                    <div className="h-2.5 bg-gray-200 rounded w-10 mb-1 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-12 mb-1 animate-pulse" />
                    <div className="h-2.5 bg-gray-100 rounded w-8 animate-pulse" />
                  </>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Chart Area */}
        {showLayout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100"
          >
            {showDetails ? (
              <>
                <p className="text-xs font-semibold text-gray-900 font-futura mb-2">Weekly Revenue</p>
                <div className="flex items-end justify-between gap-1 h-16">
                  {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY: 0, originY: 1 }}
                      animate={{ scaleY: 1 }}
                      transition={{
                        delay: i * 0.1,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      className="flex-1 bg-gradient-to-t from-sena-blue to-blue-400 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5 px-0.5">
                  {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="text-xs text-gray-400 font-futura"
                    >
                      {day}
                    </motion.span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="h-3 bg-gray-200 rounded w-20 mb-2 animate-pulse" />
                <div className="flex items-end justify-between gap-1 h-16">
                  {[40, 60, 45, 70, 55, 80, 65].map((_, i) => (
                    <div key={i} className="flex-1 bg-gray-200 rounded-t-sm animate-pulse" style={{ height: '60%' }} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Success Badge */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="flex items-center justify-center gap-1.5 py-2"
          >
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-semibold font-futura">Dashboard Complete ✓</span>
          </motion.div>
        )}
      </div>
    </motion.div>
    );
  }

  function renderTable() {
    const customers = [
      { name: "John Smith", email: "john@company.com", status: "Active" },
      { name: "Sarah Johnson", email: "sarah@tech.io", status: "Active" },
      { name: "Mike Davis", email: "mike@startup.com", status: "Inactive" }
    ];

    return (
      <motion.div
        className="w-full h-full flex items-start justify-center pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-2xl">
          {/* Table Header */}
          {showLayout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-2"
            >
              {showData ? (
                <h3 className="text-sm font-bold text-gray-900 font-futura">Customer List</h3>
              ) : (
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              )}
            </motion.div>
          )}

          {/* Table */}
          {showLayout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-3 bg-gray-50 px-3 py-2 border-b border-gray-200">
                {["Name", "Email", "Status"].map((header, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: showData ? 0.1 * i : 0 }}
                    className="text-xs font-semibold text-gray-600 font-futura uppercase"
                  >
                    {showData ? header : <div className="h-2.5 bg-gray-200 rounded w-12 animate-pulse" />}
                  </motion.div>
                ))}
              </div>

              {/* Table Rows - Render progressively */}
              <div className="divide-y divide-gray-100">
                {customers.map((customer, i) => {
                  // Show skeleton first, then data row by row
                  const shouldShowRow = showLayout;
                  const shouldShowData = showData && i < buildingStage - 1;
                  const shouldShowStatus = showDetails;

                  return shouldShowRow ? (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{
                        duration: 0.3,
                        delay: 0.3 + i * 0.15,
                        height: { type: "spring", stiffness: 300, damping: 30 }
                      }}
                      className="grid grid-cols-3 gap-3 px-3 py-2 hover:bg-gray-50 transition-colors overflow-hidden"
                    >
                      <motion.div
                        className="text-xs font-futura text-gray-900"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + i * 0.15 }}
                      >
                        {shouldShowData ? customer.name : <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />}
                      </motion.div>
                      <motion.div
                        className="text-xs font-futura text-gray-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                      >
                        {shouldShowData ? customer.email : <div className="h-3 bg-gray-100 rounded w-20 animate-pulse" />}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + i * 0.15 }}
                      >
                        {shouldShowStatus && shouldShowData ? (
                          <motion.span
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className={`inline-block px-2 py-0.5 text-xs font-semibold font-futura rounded-full ${
                              customer.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {customer.status}
                          </motion.span>
                        ) : (
                          <div className="h-4 bg-gray-100 rounded-full w-12 animate-pulse" />
                        )}
                      </motion.div>
                    </motion.div>
                  ) : null;
                })}
              </div>
            </motion.div>
          )}

          {/* Success Badge */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="flex items-center justify-center gap-1.5 py-2 mt-2"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-semibold font-futura">Table Complete ✓</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  function renderForm() {
    return (
      <motion.div
        className="w-full h-full flex items-start justify-center pt-2 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-md max-h-full overflow-hidden">
          {/* Form Header */}
          {showLayout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-2"
            >
              {showData ? (
                <>
                  <h3 className="text-sm font-bold text-gray-900 font-futura mb-0.5">Contact Form</h3>
                  <p className="text-xs text-gray-500 font-futura">Get in touch</p>
                </>
              ) : (
                <>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-1 animate-pulse" />
                  <div className="h-2.5 bg-gray-100 rounded w-20 animate-pulse" />
                </>
              )}
            </motion.div>
          )}

          {/* Form */}
          {showLayout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-2.5 space-y-2"
            >
              {/* Name Field */}
              <div>
                {showData ? (
                  <>
                    <label className="block text-xs font-semibold text-gray-700 font-futura mb-1">Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs font-futura focus:outline-none focus:border-sena-blue"
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <div className="h-3 bg-gray-200 rounded w-10 mb-1 animate-pulse" />
                    <div className="h-7 bg-gray-100 rounded-md animate-pulse" />
                  </>
                )}
              </div>

              {/* Email Field */}
              <div>
                {showData ? (
                  <>
                    <label className="block text-xs font-semibold text-gray-700 font-futura mb-1">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs font-futura focus:outline-none focus:border-sena-blue"
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <div className="h-3 bg-gray-200 rounded w-8 mb-1 animate-pulse" />
                    <div className="h-7 bg-gray-100 rounded-md animate-pulse" />
                  </>
                )}
              </div>

              {/* Message Field */}
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-xs font-semibold text-gray-700 font-futura mb-1">Message</label>
                  <textarea
                    placeholder="Type your message..."
                    rows={2}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-xs font-futura focus:outline-none focus:border-sena-blue resize-none"
                    disabled
                  />
                </motion.div>
              )}

              {/* Submit Button */}
              {isComplete && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full bg-sena-blue text-white py-2 rounded-md text-xs font-semibold font-futura hover:bg-blue-600 transition-colors"
                >
                  Submit
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Success Badge */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, delay: 0.3 }}
              className="flex items-center justify-center gap-1.5 py-2 mt-1.5"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-semibold font-futura">Form Complete ✓</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
}
