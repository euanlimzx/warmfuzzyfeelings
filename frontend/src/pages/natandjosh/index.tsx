import React, { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { useRouter } from 'next/router'
const SPRING_OPTIONS = {
  mass: 1.5,
  stiffness: 500,
  damping: 100,
};

const NeuFollowButton = ({buttonText, onClick}: {buttonText: string, onClick: () => void}) => {
  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, SPRING_OPTIONS);
  const ySpring = useSpring(y, SPRING_OPTIONS);

  const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`;

  const handleMove = (e) => {
    if (!ref.current) return;

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

  return (

      <div className="mx-auto h-1/3 w-full p-4 text-black" onClick={onClick}>
        <motion.button
          ref={ref}
          style={{
            transform,
          }}
          onMouseMove={handleMove}
          onMouseLeave={handleReset}
          onMouseDown={handleReset}
          className="group flex h-full w-full items-center justify-between border-2 border-black bg-white px-8 text-xl font-semibold"
        >
          <Copy>{buttonText}</Copy>
          <Arrow />
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
    <FiArrowRight className="shrink-0 -translate-x-full text-red-500 transition-transform duration-300 group-hover:translate-x-0" />
    <FiArrowRight className="shrink-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0" />
  </div>
);


export default function NatAndJosh() {
 const router = useRouter()
return(
    <div className="flex flex-col w-screen h-screen items-center justify-center gap-16 bg-red-500">
      <div className="max-w-md h-1/2 w-full flex flex-col items-center justify-center">
      <text className="text-white text-2xl font-bold text-center w-full">Who do you know?</text>
      <NeuFollowButton onClick={() => router.push('/make-a-wish/natandjosh?person=nat&person=josh')} buttonText="I know both Nat & Josh" />
        <NeuFollowButton onClick={() => router.push('/make-a-wish/natandjosh?person=nat')} buttonText="I only know Nat" />
        <NeuFollowButton onClick={() => router.push('/make-a-wish/natandjosh?person=josh')} buttonText="I only know Josh" />
      </div>


    </div>
)
}