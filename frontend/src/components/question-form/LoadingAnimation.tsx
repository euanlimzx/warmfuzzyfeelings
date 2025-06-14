import { motion } from "framer-motion";

const LoadingAnimation = () => {
  return (
    <div className="grid place-content-center px-4 py-28">
      <BarLoader />
    </div>
  );
};

const variants = {
  initial: {
    scaleY: 0.5,
    opacity: 0,
  },
  animate: {
    scaleY: 1,
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1,
      ease: "circIn",
    },
  },
};

const BarLoader = () => {
  return (
    <motion.div
      transition={{
        staggerChildren: 0.25,
      }}
      initial="initial"
      animate="animate"
      className="flex gap-1"
    >
      <motion.div variants={variants} className="h-10 w-2 bg-white" />
      <motion.div variants={variants} className="h-10 w-2 bg-white" />
      <motion.div variants={variants} className="h-10 w-2 bg-white" />
      <motion.div variants={variants} className="h-10 w-2 bg-white" />
      <motion.div variants={variants} className="h-10 w-2 bg-white" />
    </motion.div>
  );
};

export default LoadingAnimation;
