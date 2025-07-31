import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function BouncingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex justify-center space-x-2 mt-12", className)}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-4 h-4 bg-black border-2 border-black"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
