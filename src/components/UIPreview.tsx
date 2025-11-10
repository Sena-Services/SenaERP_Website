"use client";

import { motion } from "framer-motion";

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
        className="flex-1 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-md space-y-4">
        {/* Dashboard Title */}
        {showLayout && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-6"
          >
            {showData ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 font-futura mb-1">Revenue Dashboard</h3>
                <p className="text-xs text-gray-500 font-futura">Building in real-time...</p>
              </>
            ) : (
              <>
                <div className="h-6 bg-gray-200 rounded-md w-48 mx-auto mb-2 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded-md w-32 mx-auto animate-pulse" />
              </>
            )}
          </motion.div>
        )}

        {/* Metric Cards */}
        {showLayout && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Revenue", value: "$45.2K", change: "+12.5%" },
              { label: "Orders", value: "1,234", change: "+8.2%" },
              { label: "Users", value: "892", change: "+5.7%" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
              >
                {showData ? (
                  <>
                    <p className="text-xs text-gray-500 font-futura mb-1">{metric.label}</p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-lg font-bold text-gray-900 font-futura mb-1"
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
                    <div className="h-3 bg-gray-200 rounded w-12 mb-2 animate-pulse" />
                    <div className="h-5 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
                    <div className="h-3 bg-gray-100 rounded w-10 animate-pulse" />
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
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            {showDetails ? (
              <>
                <p className="text-sm font-semibold text-gray-900 font-futura mb-3">Weekly Revenue</p>
                <div className="flex items-end justify-between gap-1.5 h-24">
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
                      className="flex-1 bg-gradient-to-t from-waygent-blue to-blue-400 rounded-t-md"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 px-1">
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
                <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse" />
                <div className="flex items-end justify-between gap-1.5 h-24">
                  {[40, 60, 45, 70, 55, 80, 65].map((_, i) => (
                    <div key={i} className="flex-1 bg-gray-200 rounded-t-md animate-pulse" style={{ height: '60%' }} />
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
            className="flex items-center justify-center gap-2 py-3"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-600 font-semibold font-futura">Dashboard Complete ✓</span>
          </motion.div>
        )}
      </div>
    </motion.div>
    );
  }

  function renderTable() {
    const customers = [
      { name: "John Smith", email: "john@company.com", company: "Acme Corp", status: "Active" },
      { name: "Sarah Johnson", email: "sarah@tech.io", company: "Tech Solutions", status: "Active" },
      { name: "Mike Davis", email: "mike@startup.com", company: "StartupXYZ", status: "Inactive" },
      { name: "Lisa Chen", email: "lisa@design.co", company: "Design Studio", status: "Active" }
    ];

    return (
      <motion.div
        className="flex-1 flex items-center justify-center p-6"
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
              className="mb-4"
            >
              {showData ? (
                <h3 className="text-lg font-bold text-gray-900 font-futura">Customer List</h3>
              ) : (
                <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
              )}
            </motion.div>
          )}

          {/* Table */}
          {showLayout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 bg-gray-50 px-4 py-3 border-b border-gray-200">
                {["Name", "Email", "Company", "Status"].map((header, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: showData ? 0.1 * i : 0 }}
                    className="text-xs font-semibold text-gray-600 font-futura uppercase"
                  >
                    {showData ? header : <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />}
                  </motion.div>
                ))}
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-100">
                {customers.map((customer, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: showData ? 0.4 + i * 0.1 : 0.2 }}
                    className="grid grid-cols-4 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-futura text-gray-900">
                      {showData ? customer.name : <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />}
                    </div>
                    <div className="text-sm font-futura text-gray-600">
                      {showData ? customer.email : <div className="h-4 bg-gray-100 rounded w-24 animate-pulse" />}
                    </div>
                    <div className="text-sm font-futura text-gray-600">
                      {showData ? customer.company : <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />}
                    </div>
                    <div>
                      {showDetails ? (
                        <span className={`inline-block px-2 py-1 text-xs font-semibold font-futura rounded-full ${
                          customer.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {customer.status}
                        </span>
                      ) : (
                        <div className="h-5 bg-gray-100 rounded-full w-16 animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Success Badge */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className="flex items-center justify-center gap-2 py-4 mt-4"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
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
        className="flex-1 flex items-center justify-center p-6 overflow-hidden"
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
              className="mb-3"
            >
              {showData ? (
                <>
                  <h3 className="text-base font-bold text-gray-900 font-futura mb-1">Contact Form</h3>
                  <p className="text-xs text-gray-500 font-futura">Get in touch with us</p>
                </>
              ) : (
                <>
                  <div className="h-5 bg-gray-200 rounded w-28 mb-1 animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded w-32 animate-pulse" />
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
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 space-y-2.5"
            >
              {/* Name Field */}
              <div>
                {showData ? (
                  <>
                    <label className="block text-sm font-semibold text-gray-700 font-futura mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-futura focus:outline-none focus:border-waygent-blue"
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <div className="h-4 bg-gray-200 rounded w-12 mb-2 animate-pulse" />
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                  </>
                )}
              </div>

              {/* Email Field */}
              <div>
                {showData ? (
                  <>
                    <label className="block text-sm font-semibold text-gray-700 font-futura mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-futura focus:outline-none focus:border-waygent-blue"
                      disabled
                    />
                  </>
                ) : (
                  <>
                    <div className="h-4 bg-gray-200 rounded w-10 mb-2 animate-pulse" />
                    <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
                  </>
                )}
              </div>

              {/* Phone Field */}
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 font-futura mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-futura focus:outline-none focus:border-waygent-blue"
                    disabled
                  />
                </motion.div>
              )}

              {/* Message Field */}
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 font-futura mb-2">Message</label>
                  <textarea
                    placeholder="Type your message here..."
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-futura focus:outline-none focus:border-waygent-blue resize-none"
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
                  className="w-full bg-waygent-blue text-white py-2.5 rounded-lg font-semibold font-futura hover:bg-blue-600 transition-colors"
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
              className="flex items-center justify-center gap-2 py-2 mt-2"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-600 font-semibold font-futura">Form Complete ✓</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }
}
