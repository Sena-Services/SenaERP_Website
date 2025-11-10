"use client";

import { motion } from "framer-motion";

export default function UIPreview() {
  return (
    <motion.div
      className="flex-1 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="w-full max-w-md space-y-4">
        {/* Dashboard Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 font-futura mb-1">Revenue Dashboard</h3>
          <p className="text-xs text-gray-500 font-futura">Building in real-time...</p>
        </motion.div>

        {/* Metric Cards - Appearing one by one */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Revenue", value: "$45.2K", change: "+12.5%", delay: 0.7 },
            { label: "Orders", value: "1,234", change: "+8.2%", delay: 0.9 },
            { label: "Users", value: "892", change: "+5.7%", delay: 1.1 },
          ].map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: metric.delay,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
              className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
            >
              <p className="text-xs text-gray-500 font-futura mb-1">{metric.label}</p>
              <p className="text-lg font-bold text-gray-900 font-futura mb-1">{metric.value}</p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: metric.delay + 0.3 }}
                className="text-xs text-green-600 font-semibold font-futura"
              >
                {metric.change}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Chart Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
        >
          <p className="text-sm font-semibold text-gray-900 font-futura mb-3">Weekly Revenue</p>
          <div className="flex items-end justify-between gap-1.5 h-24">
            {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0, originY: 1 }}
                animate={{ scaleY: 1 }}
                transition={{
                  delay: 1.5 + i * 0.1,
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
                transition={{ delay: 2.2 }}
                className="text-xs text-gray-400 font-futura"
              >
                {day}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Success Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, type: "spring", stiffness: 300 }}
          className="flex items-center justify-center gap-2 py-3"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-green-600 font-semibold font-futura">Dashboard Complete ✓</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
