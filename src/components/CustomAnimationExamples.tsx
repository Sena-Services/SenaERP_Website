"use client";

import React from "react";
import { motion } from "framer-motion";

/**
 * Examples showing different animation patterns you can use
 * Copy any of these into your ProductFeatureShowcase!
 */

// EXAMPLE 1: Data Flowing Through Network
export function NetworkFlowAnimation() {
  return (
    <div className="relative w-full h-[400px] bg-gray-900 rounded-2xl overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-cyan-400"
            style={{ top: `${i * 5}%`, width: "100%" }}
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Data Nodes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-2xl"
          style={{
            left: `${10 + (i % 4) * 25}%`,
            top: `${20 + Math.floor(i / 4) * 50}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              "0 0 20px rgba(6, 182, 212, 0.5)",
              "0 0 40px rgba(6, 182, 212, 0.8)",
              "0 0 20px rgba(6, 182, 212, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        >
          💾
        </motion.div>
      ))}

      {/* Flying Data Packets */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [(Math.random() - 0.5) * 400],
            y: [(Math.random() - 0.5) * 400],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// EXAMPLE 2: Loading/Processing Animation
export function ProcessingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center h-[400px]">
      {/* Central Processor */}
      <motion.div
        className="relative w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mb-8"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <motion.div
          className="text-6xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          ⚡
        </motion.div>

        {/* Orbiting Elements */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-8 h-8 bg-white rounded-full flex items-center justify-center"
            style={{
              offsetPath: "path('M 0 0 m -100, 0 a 100,100 0 1,0 200,0 a 100,100 0 1,0 -200,0')",
            }}
            animate={{
              offsetDistance: ["0%", "100%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.75,
              ease: "linear",
            }}
          >
            {["📊", "📁", "🔧", "✨"][i]}
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Bars */}
      <div className="space-y-3 w-96">
        {["Analyzing...", "Processing...", "Optimizing..."].map((label, i) => (
          <div key={i}>
            <div className="text-sm text-gray-600 mb-1">{label}</div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ width: "0%" }}
                animate={{ width: ["0%", "100%", "0%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// EXAMPLE 3: Typing/Code Generation Effect
export function CodeGenerationAnimation() {
  const codeLines = [
    "function calculateTotal() {",
    "  const items = getItems();",
    "  return items.reduce(",
    "    (sum, item) => sum + item.price,",
    "    0",
    "  );",
    "}",
  ];

  return (
    <div className="bg-gray-900 rounded-2xl p-8 font-mono text-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-gray-400">main.js</span>
      </div>

      <div className="space-y-2">
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            className="text-green-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.3,
              delay: i * 0.4,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          >
            <span className="text-gray-600 mr-4">{i + 1}</span>
            {line}
            <motion.span
              className="inline-block w-2 h-4 bg-green-400 ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </div>

      {/* Success Message */}
      <motion.div
        className="mt-6 text-green-400 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5, repeat: Infinity, repeatDelay: 3 }}
      >
        <span>✓</span> Code generated successfully!
      </motion.div>
    </div>
  );
}

// EXAMPLE 4: Document/File Upload Animation
export function FileUploadAnimation() {
  return (
    <div className="relative h-[400px] flex items-center justify-center">
      {/* Upload Zone */}
      <motion.div
        className="w-96 h-64 border-4 border-dashed border-blue-400 rounded-3xl flex flex-col items-center justify-center"
        animate={{
          borderColor: ["#60a5fa", "#a78bfa", "#60a5fa"],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ y: [-10, 0, -10] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ☁️
        </motion.div>
        <div className="text-xl font-semibold text-gray-700">Drop files here</div>
      </motion.div>

      {/* Flying Files */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-16 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-xl flex items-center justify-center text-3xl"
          style={{ left: `${20 + i * 15}%` }}
          animate={{
            y: [400, -50],
            rotate: [0, 360],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        >
          📄
        </motion.div>
      ))}

      {/* Success Checkmarks */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-20 right-20 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0],
            x: [(i - 1) * 30],
            y: [0, -100],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 1 + i * 0.3,
          }}
        >
          ✓
        </motion.div>
      ))}
    </div>
  );
}

// EXAMPLE 5: Real-time Chat/Messages
export function ChatAnimation() {
  const messages = [
    { text: "Hey, how's the project going?", user: "Alice", color: "bg-blue-100" },
    { text: "Great! Just finished the feature", user: "You", color: "bg-purple-100", align: "right" },
    { text: "Awesome! Can you demo it?", user: "Alice", color: "bg-blue-100" },
    { text: "Sure, sharing my screen now", user: "You", color: "bg-purple-100", align: "right" },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 max-w-2xl mx-auto shadow-xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b">
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-2xl"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👥
        </motion.div>
        <div>
          <div className="font-bold text-gray-800">Team Chat</div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            3 members online
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            className={`flex ${msg.align === "right" ? "justify-end" : "justify-start"}`}
            initial={{ opacity: 0, x: msg.align === "right" ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              delay: i * 1.5,
              repeat: Infinity,
              repeatDelay: 6,
            }}
          >
            <div className={`${msg.color} rounded-2xl px-4 py-3 max-w-xs`}>
              <div className="text-xs font-semibold text-gray-600 mb-1">{msg.user}</div>
              <div className="text-gray-800">{msg.text}</div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, repeat: Infinity, repeatDelay: 6 }}
        >
          <div className="bg-blue-100 rounded-2xl px-4 py-3 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gray-400 rounded-full"
                animate={{ y: [-3, 0, -3] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// EXAMPLE 6: Dashboard Metrics Counter
export function MetricsCounterAnimation() {
  return (
    <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
      {[
        { label: "Total Users", end: 15420, icon: "👥", color: "from-blue-500 to-cyan-500" },
        { label: "Revenue", end: 98750, prefix: "$", icon: "💰", color: "from-green-500 to-emerald-500" },
        { label: "Active Projects", end: 342, icon: "📊", color: "from-purple-500 to-pink-500" },
        { label: "Tasks Completed", end: 8967, icon: "✅", color: "from-orange-500 to-red-500" },
      ].map((metric, i) => (
        <motion.div
          key={i}
          className={`bg-gradient-to-br ${metric.color} rounded-3xl p-8 text-white shadow-2xl`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-5xl mb-4">{metric.icon}</div>
          <div className="text-sm font-medium opacity-90 mb-2">{metric.label}</div>
          <motion.div
            className="text-5xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2 + 0.5 }}
          >
            {metric.prefix}
            <motion.span
              initial={{ textContent: "0" }}
              animate={{ textContent: metric.end.toString() }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                ease: "easeOut",
              }}
            >
              0
            </motion.span>
          </motion.div>

          {/* Trend Arrow */}
          <motion.div
            className="flex items-center gap-2 mt-4 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 + 1 }}
          >
            <motion.span
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ↗
            </motion.span>
            <span>+12.5% from last month</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
