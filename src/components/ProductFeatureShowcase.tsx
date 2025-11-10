"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  visualization: React.ReactNode;
}

export default function ProductFeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState("automation");

  const features: Feature[] = [
    {
      id: "automation",
      title: "Smart Automation",
      description: "Automatically handle repetitive tasks with intelligent workflows",
      icon: "⚡",
      visualization: <AutomationVisualization />,
    },
    {
      id: "analytics",
      title: "Real-time Analytics",
      description: "Track performance metrics and insights as they happen",
      icon: "📊",
      visualization: <AnalyticsVisualization />,
    },
    {
      id: "collaboration",
      title: "Team Collaboration",
      description: "Work together seamlessly with your entire team",
      icon: "👥",
      visualization: <CollaborationVisualization />,
    },
    {
      id: "integration",
      title: "API Integration",
      description: "Connect with all your favorite tools and services",
      icon: "🔗",
      visualization: <IntegrationVisualization />,
    },
  ];

  const activeFeatureData = features.find((f) => f.id === activeFeature) || features[0];

  return (
    <div className="py-20 px-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Experience Our Features
          </h2>
          <p className="text-xl text-gray-600">
            Click on any feature to see it in action
          </p>
        </div>

        {/* Feature Tabs */}
        <div className="flex flex-wrap gap-4 justify-center mb-12">
          {features.map((feature) => (
            <motion.button
              key={feature.id}
              onClick={() => setActiveFeature(feature.id)}
              className={`px-6 py-4 rounded-2xl font-semibold text-lg transition-all ${
                activeFeature === feature.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl"
                  : "bg-white text-gray-700 hover:shadow-lg"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2 text-2xl">{feature.icon}</span>
              {feature.title}
            </motion.button>
          ))}
        </div>

        {/* Visualization Area */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-2">{activeFeatureData.title}</h3>
                  <p className="text-gray-600 text-lg">{activeFeatureData.description}</p>
                </div>

                {/* Animated Visualization */}
                <div className="min-h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                  {activeFeatureData.visualization}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= ANIMATED VISUALIZATIONS (All in code!) =============

function AutomationVisualization() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Workflow boxes */}
      <div className="flex items-center justify-between gap-8">
        {/* Input Box */}
        <motion.div
          className="w-40 h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="text-center">
            <div className="text-5xl mb-2">📥</div>
            <div className="font-semibold">Input</div>
          </div>
        </motion.div>

        {/* Animated Arrow with Particles */}
        <div className="flex-1 relative">
          <motion.div
            className="absolute left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
            style={{ top: "50%" }}
            animate={{
              background: [
                "linear-gradient(to right, #60a5fa, #a78bfa)",
                "linear-gradient(to right, #a78bfa, #60a5fa)",
                "linear-gradient(to right, #60a5fa, #a78bfa)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Moving Particles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-yellow-400 rounded-full"
              style={{ top: "50%", left: 0, y: "-50%" }}
              animate={{
                x: ["0%", "100%"],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Processing Box */}
        <motion.div
          className="w-40 h-40 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl relative overflow-hidden"
          animate={{
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
          <div className="text-center relative z-10">
            <motion.div
              className="text-5xl mb-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ⚙️
            </motion.div>
            <div className="font-semibold">Process</div>
          </div>
        </motion.div>

        {/* Animated Arrow */}
        <div className="flex-1 relative">
          <motion.div
            className="absolute left-0 right-0 h-2 bg-gradient-to-r from-purple-400 to-green-400 rounded-full"
            style={{ top: "50%" }}
            animate={{
              background: [
                "linear-gradient(to right, #a78bfa, #4ade80)",
                "linear-gradient(to right, #4ade80, #a78bfa)",
                "linear-gradient(to right, #a78bfa, #4ade80)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-yellow-400 rounded-full"
              style={{ top: "50%", left: 0, y: "-50%" }}
              animate={{
                x: ["0%", "100%"],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            />
          ))}
        </div>

        {/* Output Box */}
        <motion.div
          className="w-40 h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-white shadow-xl"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="text-center">
            <motion.div
              className="text-5xl mb-2"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ✅
            </motion.div>
            <div className="font-semibold">Output</div>
          </div>
        </motion.div>
      </div>

      {/* Success Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400 rounded-full"
          style={{
            right: "10%",
            top: "50%",
          }}
          animate={{
            y: [0, -100, -200],
            x: [0, (i - 3) * 30],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

function AnalyticsVisualization() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl p-8 shadow-xl">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-2xl font-bold text-gray-800">Live Dashboard</h4>
          <motion.div
            className="w-3 h-3 bg-green-500 rounded-full"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { label: "Users", value: 2847, color: "blue", icon: "👥" },
            { label: "Revenue", value: "$12.4K", color: "green", icon: "💰" },
            { label: "Events", value: 8392, color: "purple", icon: "📈" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 rounded-xl p-6`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              <motion.div
                className="text-3xl font-bold text-gray-800"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              >
                {stat.value}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Animated Bar Chart */}
        <div className="space-y-4">
          {[
            { label: "Mon", value: 70, color: "bg-blue-500" },
            { label: "Tue", value: 85, color: "bg-purple-500" },
            { label: "Wed", value: 60, color: "bg-green-500" },
            { label: "Thu", value: 95, color: "bg-yellow-500" },
            { label: "Fri", value: 80, color: "bg-red-500" },
            { label: "Sat", value: 50, color: "bg-pink-500" },
            { label: "Sun", value: 65, color: "bg-indigo-500" },
          ].map((bar, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 text-sm font-medium text-gray-600">{bar.label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <motion.div
                  className={`${bar.color} h-full rounded-full flex items-center justify-end pr-3 text-white font-semibold text-sm`}
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.value}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.5 }}
                  >
                    {bar.value}%
                  </motion.span>
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CollaborationVisualization() {
  const avatars = [
    { name: "Alice", color: "bg-pink-400", emoji: "👩" },
    { name: "Bob", color: "bg-blue-400", emoji: "👨" },
    { name: "Carol", color: "bg-green-400", emoji: "👩‍🦰" },
    { name: "Dave", color: "bg-purple-400", emoji: "👨‍🦱" },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px]">
      {/* Central Document */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 bg-white rounded-2xl shadow-2xl p-6 z-10"
        animate={{
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">📄</div>
          <div className="font-bold text-gray-800">Shared Document</div>
        </div>

        {/* Typing Lines */}
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-3 bg-gray-200 rounded"
              initial={{ width: 0 }}
              animate={{ width: ["0%", "100%", "100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            />
          ))}
        </div>

        {/* Cursor Indicators */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-4 rounded-full"
            style={{
              left: "20%",
              top: `${40 + i * 20}%`,
              background: ["#ec4899", "#3b82f6", "#10b981"][i],
            }}
            animate={{
              x: [0, 150, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
            }}
          />
        ))}
      </motion.div>

      {/* Team Members Around Document */}
      {avatars.map((avatar, i) => {
        const angle = (i * 360) / avatars.length;
        const radius = 200;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ x: x - 40, y: y - 40 }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <div className={`w-20 h-20 ${avatar.color} rounded-full flex items-center justify-center text-3xl shadow-lg`}>
              {avatar.emoji}
            </div>
            <div className="text-center mt-2 font-semibold text-gray-700">{avatar.name}</div>

            {/* Connection Lines */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-1 origin-left"
              style={{
                height: radius,
                rotate: angle + 180,
                background: "linear-gradient(to right, rgba(59, 130, 246, 0.5), transparent)",
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />

            {/* Activity Pulses */}
            <motion.div
              className={`absolute top-0 right-0 w-4 h-4 ${avatar.color} rounded-full`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
              }}
            />
          </motion.div>
        );
      })}

      {/* Chat Bubbles */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-lg px-4 py-2 shadow-lg text-sm"
          style={{
            left: `${20 + i * 25}%`,
            top: `${80 + (i % 2) * 5}%`,
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -10] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.5,
          }}
        >
          "Great work! 👍"
        </motion.div>
      ))}
    </div>
  );
}

function IntegrationVisualization() {
  const integrations = [
    { name: "Slack", icon: "💬", color: "bg-purple-500" },
    { name: "GitHub", icon: "🐙", color: "bg-gray-800" },
    { name: "Google", icon: "🔍", color: "bg-blue-500" },
    { name: "Stripe", icon: "💳", color: "bg-indigo-600" },
    { name: "AWS", icon: "☁️", color: "bg-orange-500" },
    { name: "Figma", icon: "🎨", color: "bg-pink-500" },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto h-[400px]">
      {/* Central Hub */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl z-20"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          scale: { duration: 2, repeat: Infinity },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      >
        <div className="text-center">
          <div className="text-4xl">🚀</div>
          <div className="text-xs font-bold mt-1">API Hub</div>
        </div>
      </motion.div>

      {/* Integration Nodes */}
      {integrations.map((integration, i) => {
        const angle = (i * 360) / integrations.length;
        const radius = 160;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <React.Fragment key={i}>
            {/* Connection Line with Animation */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-1 origin-left"
              style={{
                height: radius,
                rotate: angle,
                background: "linear-gradient(to right, rgba(147, 51, 234, 0.5), transparent)",
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />

            {/* Data Packets Moving */}
            <motion.div
              className="absolute left-1/2 top-1/2 w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                offsetPath: `path("M 0 0 L ${x} ${y}")`,
              }}
              animate={{
                offsetDistance: ["0%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
              }}
            />

            {/* Integration Icon */}
            <motion.div
              className="absolute left-1/2 top-1/2"
              style={{ x: x - 32, y: y - 32 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, type: "spring" }}
            >
              <motion.div
                className={`w-16 h-16 ${integration.color} rounded-xl flex items-center justify-center text-2xl shadow-xl`}
                whileHover={{ scale: 1.2, rotate: 10 }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  },
                }}
              >
                {integration.icon}
              </motion.div>
              <div className="text-center mt-2 text-xs font-bold text-gray-700">
                {integration.name}
              </div>

              {/* Success Check Animation */}
              <motion.div
                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{
                  delay: i * 0.3 + 1,
                  duration: 0.5,
                }}
              >
                ✓
              </motion.div>
            </motion.div>
          </React.Fragment>
        );
      })}

      {/* Pulsing Ring Effect */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-purple-400"
          animate={{
            width: [0, 400],
            height: [0, 400],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
          }}
        />
      ))}
    </div>
  );
}
