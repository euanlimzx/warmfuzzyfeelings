import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subDays, addDays, format } from "date-fns";
import confetti from "canvas-confetti";
import { Notifications } from "./notifications";

const BIRTHDAY_OFFSET = 4;
export const Countdown = () => {
  const date = new Date();
  return (
    <div className="grid place-content-center h-screen gradient-background">
      <style jsx>{`
        .gradient-background {
          background: linear-gradient(300deg, #ffcee6, #e7d6ff, #ffd6f3);
          background-size: 180% 180%;
          animation: gradient-animation 4s ease infinite;
        }

        @keyframes gradient-animation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      {/* <Notifications /> */}
      <FlipCalendar birthdayWithOffset={subDays(date, BIRTHDAY_OFFSET)} />
    </div>
  );
};

const FlipCalendar = ({ birthdayWithOffset }) => {
  const [index, setIndex] = useState(0);
  const [date, setDate] = useState(birthdayWithOffset);
  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  useEffect(() => {
    let currentCount = 0;
    const interval = setInterval(() => {
      if (currentCount < BIRTHDAY_OFFSET) {
        incrementDate();
        currentCount++;
      } else {
        triggerConfetti();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const incrementDate = () => {
    setIndex((pv) => pv + 1);
    setDate((date) => addDays(date, 1));
  };

  return (
    <div className="relative flex flex-col items-center text-indigo-950">
      <CalendarDisplay index={index} date={date} />
    </div>
  );
};

const CalendarDisplay = ({ index, date }) => {
  return (
    <div className="w-fit overflow-hidden rounded-xl border-2 md:border-4 border-red-300 bg-red-300">
      <div className="flex items-center justify-between px-2 md:px-3 py-0.5 md:py-1">
        <span className="text-center uppercase text-white text-xl md:text-2xl">
          {format(date, "LLLL")}
        </span>
      </div>
      <div className="relative z-0 h-48 md:h-72 w-72 md:w-104 shrink-0">
        <AnimatePresence mode="sync">
          <motion.div
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
              zIndex: -index,
              backfaceVisibility: "hidden",
            }}
            key={index}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            initial={{ rotateX: "0deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "-180deg" }}
            className="absolute inset-0"
          >
            <div className="grid h-full w-full place-content-center rounded-lg bg-white text-6xl md:text-8xl">
              {format(date, "do")}
            </div>
          </motion.div>
          <motion.div
            style={{
              clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
              zIndex: index,
              backfaceVisibility: "hidden",
            }}
            key={(index + 1) * 2}
            initial={{ rotateX: "180deg" }}
            animate={{ rotateX: "0deg" }}
            exit={{ rotateX: "0deg" }}
            transition={{
              duration: 0.75,
              ease: "easeInOut",
            }}
            className="absolute inset-0"
          >
            <div className="relative grid h-full w-full place-content-center rounded-lg bg-white text-6xl md:text-8xl">
              {format(date, "do")}
              <span className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 text-sm md:text-base">
                {format(date, "yyyy")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
