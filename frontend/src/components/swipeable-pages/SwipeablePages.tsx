"use client";

import { useState, Children, type ReactElement } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";

interface SwipeableWrapperProps {
  children: ReactElement[];
  showButtons: boolean;
}

interface AnimatedChildProps {
  children: ReactElement;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  direction: "forward" | "backward";
}

function AnimatedChild({
  children,
  onSwipeUp,
  onSwipeDown,
  direction,
}: AnimatedChildProps) {
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // If dragged up more than 100px with sufficient velocity, trigger swipe up
    if (info.offset.y < -100 && info.velocity.y < -500) {
      onSwipeUp();
    }
    // If dragged down more than 100px with sufficient velocity, trigger swipe down
    else if (info.offset.y > 100 && info.velocity.y > 500) {
      onSwipeDown();
    }
  };

  // Animation variants based on direction
  const variants = {
    initial: direction === "forward" ? { y: "100%" } : { y: "-100%" },
    animate: { y: 0 },
    exit: direction === "forward" ? { y: "-100%" } : { y: "100%" },
  };

  return (
    <motion.div
      className="fixed inset-0 cursor-grab active:cursor-grabbing"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={{
        type: "spring",
        damping: 30,
        stiffness: 300,
        duration: 0.5,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function SwipeablePages({
  children,
  showButtons,
}: SwipeableWrapperProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  const childrenArray = Children.toArray(children) as ReactElement[];
  const totalPages = childrenArray.length;

  const handleSwipeUp = () => {
    if (currentIndex < totalPages - 1) {
      setDirection("forward");
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setDirection("backward");
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="popLayout">
        <AnimatedChild
          key={currentIndex}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
          direction={direction}
        >
          {childrenArray[currentIndex]}
        </AnimatedChild>
      </AnimatePresence>
      {showButtons && (
        <div className="fixed bottom-10 right-10">
          <button
            onClick={handleSwipeDown}
            disabled={currentIndex === 0}
            className="bg-white backdrop-blur-sm text-black px-4 py-2 border-2 h-15 w-15 border-black transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center"
          >
            <IoMdArrowUp size={25} />
          </button>
          <button
            onClick={handleSwipeUp}
            disabled={currentIndex === totalPages - 1}
            className="bg-white backdrop-blur-sm text-black px-4 py-2 border-2 h-15 w-15 border-black transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] flex items-center justify-center"
          >
            <IoMdArrowDown size={25} />
          </button>
        </div>
      )}
    </div>
  );
}
