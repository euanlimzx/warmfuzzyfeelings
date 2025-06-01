"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Item {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
  id: number;
}

let notifications = [
  {
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
].map((notif, index) => ({ ...notif, id: index }));

const Notification = ({ name, description, icon, color, time }: Item) => {
  return (
    <motion.figure
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: [1, 1, 0],
        y: [0, 40, 60],
        transition: {
          duration: 0.5,
          times: [0, 0.7, 1],
        },
      }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </motion.figure>
  );
};

export function Notifications({ className }: { className?: string }) {
  const [visibleNotifications, setVisibleNotifications] = useState<Item[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % notifications.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newNotification = notifications[currentIndex];
    setVisibleNotifications((prev) => {
      const updated = [...prev, newNotification].slice(-2);
      return updated;
    });
  }, [currentIndex]);

  return (
    <div className="fixed top-4 right-4 space-y-4 w-[400px]">
      <AnimatePresence mode="sync">
        {visibleNotifications.map((item, index) => (
          <div
            key={item.id}
            style={{ position: "absolute", top: index * 80, width: "100%" }}
          >
            <Notification {...item} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
