import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { orbit } from "ldrs";

const SPRING_OPTIONS = {
  mass: 1.5,
  stiffness: 500,
  damping: 100,
};

interface SubmitFormButtonProps {
  submitForm: () => void;
  bgColor: string;
  isLoading: boolean;
}

const SubmitFormButton = ({
  submitForm,
  bgColor,
  isLoading,
}: SubmitFormButtonProps) => {
  orbit.register();
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, SPRING_OPTIONS);
  const ySpring = useSpring(y, SPRING_OPTIONS);

  const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;

  const handleMove = (e) => {
    if (!ref.current || isLoading) return;

    const { height, width } = ref.current.getBoundingClientRect();
    const { offsetX, offsetY } = e.nativeEvent;

    const xPct = offsetX / width;
    const yPct = 1 - offsetY / height;

    const newY = 12 + yPct * 12;
    const newX = 12 + xPct * 12;

    x.set(newX);
    y.set(-newY);
  };

  const handleReset = () => {
    x.set(0);
    y.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoading) {
      e.preventDefault();
      submitForm();
    }
  };

  return (
    <div
      className={`mx-auto h-15 w-full bg-black ${
        isLoading ? "cursor-not-allowed" : "hover:cursor-pointer"
      }`}
      onClick={handleClick}
    >
      <motion.button
        ref={ref}
        disabled={isLoading}
        style={{
          transform,
        }}
        onMouseMove={handleMove}
        onMouseLeave={handleReset}
        onMouseDown={handleReset}
        className={`group flex h-full w-full items-center justify-between border-2 border-black text-white bg-purple-400 px-8 text-xl font-semibold ${
          isLoading ? "bg-purple-700 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full ">
            <l-orbit size="47" speed="1" color="white"></l-orbit>
          </div>
        ) : (
          <>
            <Copy>SEND YOUR WISHES!</Copy>
            <Arrow />
          </>
        )}
      </motion.button>
    </div>
  );
};

const Copy = ({ children }) => {
  return (
    <span className="relative overflow-hidden">
      <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-0 block translate-y-full transition-transform duration-300 group-hover:translate-y-0">
        {children}
      </span>
    </span>
  );
};

const Arrow = () => (
  <div className="pointer-events-none flex h-6 w-6 overflow-hidden text-2xl">
    <FiArrowRight className="shrink-0 -translate-x-full text-white transition-transform duration-300 group-hover:translate-x-0" />
    <FiArrowRight className="shrink-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
  </div>
);

export default SubmitFormButton;
