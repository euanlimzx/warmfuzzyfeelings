import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { subDays, addDays, format } from "date-fns";

const BIRTHDAY_OFFSET = 4;
export const Countdown = () => {
  const date = new Date();
  return (
    <div className="grid place-content-center bg-white h-screen px-4 py-24 md:flex-row">
      <FlipCalendar birthdayWithOffset={subDays(date, BIRTHDAY_OFFSET)} />
    </div>
  );
};

const FlipCalendar = ({ birthdayWithOffset }) => {
  const [index, setIndex] = useState(0);
  const [date, setDate] = useState(birthdayWithOffset);

  useEffect(() => {
    let currentCount = 0;
    const interval = setInterval(() => {
      if (currentCount < BIRTHDAY_OFFSET) {
        incrementDate();
        currentCount++;
      } else {
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
    <div className="w-fit overflow-hidden rounded-xl border-2 border-indigo-500 bg-indigo-500">
      <div className="flex items-center justify-between px-1.5 py-0.5">
        <span className="text-center uppercase text-white">
          {format(date, "LLLL")}
        </span>
      </div>
      <div className="relative z-0 h-36 w-52 shrink-0">
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
            <div className="grid h-full w-full place-content-center rounded-lg bg-white text-6xl">
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
            <div className="relative grid h-full w-full place-content-center rounded-lg bg-white text-6xl">
              {format(date, "do")}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs">
                {format(date, "yyyy")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
