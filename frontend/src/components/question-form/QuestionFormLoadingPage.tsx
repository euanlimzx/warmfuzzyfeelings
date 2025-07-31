"use client";

import type React from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";
import BouncingDots from "../ui/BouncingDots";

export default function QuestionFormLoadingPage() {
  return (
    <div className="w-full max-w-4xl mx-auto p-24">
      <div className="relative">
        <motion.div
          className={`
            transition-all duration-200 
          `}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key="loading-state"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center flex flex-col justify-evenly h-full"
            >
              {/* Animated Upload Icon */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="mb-8"
              >
                <div className="inline-block p-6 bg-black border-4 border-black">
                  <Upload size={64} className="text-white" strokeWidth={3} />
                </div>
              </motion.div>

              {/* Bouncing Dots */}
              <BouncingDots />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
