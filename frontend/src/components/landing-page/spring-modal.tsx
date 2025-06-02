import axios from "axios";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FormSubmissionErrorNotification } from "../question-form/Notifications";

interface SpringModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SpringModal = ({ isOpen, setIsOpen }: SpringModalProps) => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [showSuccessNotif, setShowSuccessNotif] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    let timeoutId: NodeJS.Timeout;

    if (isOpen) {
      timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 100);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/join-waitlist`,
      {
        email: email,
      }
    );
    console.log(response);
    setShowSuccessNotif(true);
    setTimeout(() => {
      setShowSuccessNotif(false);
      setIsOpen(false);
    }, 1000);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsValidEmail(true); // Reset validation on change
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className="bg-red-600 text-white p-10 w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            {showSuccessNotif && (
              <FormSubmissionErrorNotification
                errorMessage="Thanks! We got your email 🎉"
                removeNotif={() => setShowSuccessNotif(false)}
              />
            )}
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-center mb-2">
                We&apos;ll let you know when we launch!
              </h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-full">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full p-2 bg-white border-3 border-black rounded-none focus:outline-none focus:ring-0 focus:border-black text-black caret-black ${
                      !isValidEmail ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full sm:w-fit px-6 py-2 font-medium border-2 border-black bg-white text-black transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                >
                  Submit
                </button>
              </div>
              {!isValidEmail && (
                <p className="text-white text-sm mt-1 font-medium">
                  Invalid email address
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpringModal;
