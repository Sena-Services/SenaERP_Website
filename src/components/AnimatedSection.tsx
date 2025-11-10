"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: "fade" | "slideUp" | "slideLeft" | "slideRight" | "scale" | "stagger";
  once?: boolean;
}

/**
 * AnimatedSection - A reusable component for scroll-triggered animations
 *
 * @param animation - Type of animation: "fade", "slideUp", "slideLeft", "slideRight", "scale", "stagger"
 * @param delay - Delay before animation starts (in seconds)
 * @param duration - Duration of animation (in seconds)
 * @param once - If true, animation only plays once
 */
export default function AnimatedSection({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  animation = "slideUp",
  once = true,
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once,
    amount: 0.3, // Trigger when 30% of element is visible
  });

  // Animation variants based on type
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration, delay }
      }
    },
    slideUp: {
      hidden: { opacity: 0, y: 60 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1] // Custom easing for smooth motion
        }
      }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 60 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
      }
    },
    slideRight: {
      hidden: { opacity: 0, x: -60 },
      visible: {
        opacity: 1,
        x: 0,
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
      }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { duration, delay, ease: [0.22, 1, 0.36, 1] }
      }
    },
    stagger: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: delay,
        }
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[animation]}
    >
      {children}
    </motion.div>
  );
}

// Export a child component for stagger animations
export function AnimatedChild({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
