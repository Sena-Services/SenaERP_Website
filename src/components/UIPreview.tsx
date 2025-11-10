"use client";

import { motion } from "framer-motion";

interface UIPreviewProps {
  buildingStage: number;
}

export default function UIPreview({ buildingStage }: UIPreviewProps) {
  // Stage 1: Analyzing (show nothing)
  // Stage 2: Creating layout (show skeleton title + card skeletons)
  // Stage 3: Building metric cards (show cards with data)
  // Stage 4: Generating chart (show chart building)
  // Stage 5: Finalizing (show complete dashboard)

  const showLayout = buildingStage >= 2;
  const showMetrics = buildingStage >= 3;
  const showChart = buildingStage >= 4;
  const isComplete = buildingStage >= 5;

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
            {showMetrics ? (
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
                {showMetrics ? (
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
            {showChart ? (
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
