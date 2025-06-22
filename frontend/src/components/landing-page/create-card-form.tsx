import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InputField from "../question-form/InputField";

const CreateCardForm = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [stepsComplete, setStepsComplete] = useState(0);
  const numSteps = 3;

  useEffect(() => {
    if (stepsComplete === numSteps) {
      setIsOpen(false);
    }
  }, [stepsComplete, numSteps, setIsOpen]);

  const handleSetStep = (num: number) => {
    if (
      (stepsComplete === 0 && num === -1) ||
      (stepsComplete === numSteps && num === 1)
    ) {
      return;
    }
    setStepsComplete((pv) => pv + num);
  };

  return (
    <div className="p-8 bg-white rounded-md w-full max-w-2xl mx-auto">
      <Steps numSteps={numSteps} stepsComplete={stepsComplete} />
      <div className="mt-8">
        {stepsComplete === 0 && <StepOne />}
        {stepsComplete === 1 && <StepTwo />}
        {stepsComplete === 2 && <StepThree />}
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          className="px-4 py-1 rounded hover:bg-gray-100 text-black"
          onClick={() => handleSetStep(-1)}
        >
          Prev
        </button>
        <button
          className="px-4 py-1 rounded bg-black text-white"
          onClick={() => handleSetStep(1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const Steps = ({
  numSteps,
  stepsComplete,
}: {
  numSteps: number;
  stepsComplete: number;
}) => {
  const stepArray = Array.from(Array(numSteps).keys());

  return (
    <div className="flex items-center justify-between gap-3">
      {stepArray.map((num) => {
        const stepNum = num + 1;
        const isActive = stepNum <= stepsComplete;
        return (
          <React.Fragment key={stepNum}>
            <Step num={stepNum} isActive={isActive} />
            {stepNum !== stepArray.length && (
              <div className="w-full h-1 rounded-full bg-gray-200 relative">
                <motion.div
                  className="absolute top-0 bottom-0 left-0 bg-indigo-600 rounded-full"
                  animate={{ width: isActive ? "100%" : 0 }}
                  transition={{ ease: "easeIn", duration: 0.3 }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const Step = ({ num, isActive }: { num: number; isActive: boolean }) => {
  return (
    <div className="relative">
      <div
        className={`w-10 h-10 flex items-center justify-center shrink-0 border-2 rounded-full font-semibold text-sm relative z-10 transition-colors duration-300 ${
          isActive
            ? "border-indigo-600 bg-indigo-600 text-white"
            : "border-gray-300 text-gray-300"
        }`}
      >
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.svg
              key="icon-marker-check"
              stroke="currentColor"
              fill="currentColor"
              strokeWidth="0"
              viewBox="0 0 16 16"
              height="1.6em"
              width="1.6em"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"></path>
            </motion.svg>
          ) : (
            <motion.span
              key="icon-marker-num"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.125 }}
            >
              {num}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {isActive && (
        <div className="absolute z-0 -inset-1.5 bg-indigo-100 rounded-full animate-pulse" />
      )}
    </div>
  );
};

const StepOne = () => {
  const bgColor = "bg-yellow-100";
  const [name, setName] = useState("");

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">
        Tell us who the birthday star is, and when to deliver their surprise.
      </h3>

      <InputField
        inputValue={name}
        setInputValue={setName}
        bgColor={bgColor}
        label="What's the birthday person's name?"
      />
    </div>
  );
};

const StepTwo = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Step 2: Details</h3>
      <p className="text-gray-600">
        This is the second step of your card creation process.
      </p>
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-green-800">Step 2 content goes here</p>
      </div>
    </div>
  );
};

const StepThree = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">
        Step 3: Final Review
      </h3>
      <p className="text-gray-600">
        This is the final step of your card creation process.
      </p>
      <div className="p-4 bg-purple-50 rounded-lg">
        <p className="text-purple-800">Step 3 content goes here</p>
      </div>
    </div>
  );
};

export default CreateCardForm;
