"use client";

import React from "react";
import { motion } from "framer-motion";
import AnimatedSection, { AnimatedChild } from "./AnimatedSection";

/**
 * Example component demonstrating animations similar to the reference website
 * Shows cards that animate in with images appearing smoothly
 */
export default function AnimatedCardExample() {
  const cardData = [
    {
      title: "Research competitors",
      icon: "🔍",
      bgColor: "bg-blue-50",
      image: "/placeholder-1.jpg"
    },
    {
      title: "Analyze market",
      icon: "📊",
      bgColor: "bg-purple-50",
      image: "/placeholder-2.jpg"
    },
    {
      title: "Generate campaign brief",
      icon: "📝",
      bgColor: "bg-green-50",
      image: "/placeholder-3.jpg"
    },
  ];

  return (
    <div className="py-20 px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with fade animation */}
      <AnimatedSection animation="fade" duration={0.8} className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-4">Creative Agent</h2>
        <p className="text-xl text-gray-600">
          Create on brand marketing campaigns with just a prompt.
        </p>
      </AnimatedSection>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Left side - Workflow steps with stagger animation */}
        <AnimatedSection animation="stagger" delay={0.2}>
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-8">Workflow Steps</h3>

            <div className="space-y-4">
              {cardData.map((step, index) => (
                <AnimatedChild key={index}>
                  <motion.div
                    className={`${step.bgColor} rounded-xl p-6 flex items-center gap-4 cursor-pointer`}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-3xl">{step.icon}</div>
                    <div className="font-medium text-lg">{step.title}</div>
                  </motion.div>
                </AnimatedChild>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Right side - Animated cards appearing */}
        <AnimatedSection animation="slideLeft" delay={0.4} duration={0.8}>
          <div className="relative h-full min-h-[500px]">
            {/* Card 1 - TikTok style */}
            <motion.div
              className="absolute top-0 left-0 w-48 h-64 rounded-2xl overflow-hidden shadow-2xl z-30"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
            >
              <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-3 py-1 rounded-full z-10">
                Tik Tok
              </div>
              <div className="w-full h-full bg-gradient-to-br from-cyan-200 to-blue-300 flex items-center justify-center">
                <div className="text-6xl">📱</div>
              </div>
            </motion.div>

            {/* Card 2 - Facebook style */}
            <motion.div
              className="absolute bottom-10 left-20 w-40 h-56 rounded-2xl overflow-hidden shadow-2xl z-20"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 5 }}
              transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
            >
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full z-10">
                Facebook
              </div>
              <div className="w-full h-full bg-gradient-to-br from-amber-200 to-yellow-300 flex items-center justify-center">
                <div className="text-5xl">🎨</div>
              </div>
            </motion.div>

            {/* Card 3 - Instagram style */}
            <motion.div
              className="absolute top-16 right-0 w-48 h-64 rounded-2xl overflow-hidden shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.8, rotate: 8 }}
              animate={{ opacity: 1, scale: 1, rotate: 8 }}
              transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
            >
              <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full z-10">
                Instagram
              </div>
              <div className="w-full h-full bg-gradient-to-br from-green-200 to-cyan-300 flex items-center justify-center">
                <div className="text-6xl">✨</div>
              </div>
            </motion.div>
          </div>
        </AnimatedSection>
      </div>

      {/* Button with scale animation */}
      <AnimatedSection animation="scale" delay={1.2} className="text-center mt-16">
        <motion.button
          className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get the agent →
        </motion.button>
      </AnimatedSection>
    </div>
  );
}
