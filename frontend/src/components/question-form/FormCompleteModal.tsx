import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useState } from "react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/router";

interface FormCompleteModalProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  birthdayPerson: string;
  bgColor: string;
  cardUUID: string;
}

// TODO: The mobile styling does not work
const FormCompleteModal = ({
  isOpen,
  setIsOpen,
  birthdayPerson,
  bgColor,
  cardUUID,
}: FormCompleteModalProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmission = async () => {
    if (!email) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/make-a-wish/register-email`,
        {
          email,
          cardUUID,
        }
      );
      setEmail("");
      setEmailError("");
      setIsOpen(false);
      router.push("/");
    } catch (err) {
      console.error(err);
      setEmailError("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsOpen(false);
            router.push("/");
          }}
          className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
        >
          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            onClick={(e) => e.stopPropagation()}
            className={`${bgColor} text-black border-2 border-black p-10  w-full max-w-lg shadow-xl cursor-default relative overflow-hidden`}
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-center mb-2">
                Thanks! Your submission was so good, we&apos;ll probably frame
                it.
              </h3>
              <h3 className="text-lg font-medium text-center mb-2">
                If you&apos;d like to see how {birthdayPerson} responds to this
                card, drop your email and we&apos;ll be sure to let you know.
                You could also use our site to create a card for your other
                friends 😉
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex flex-col w-full">
                  <input
                    type="email"
                    placeholder="Enter your email!"
                    className={`w-full p-2 bg-white border-3 border-black rounded-none focus:outline-none focus:ring-0 focus:border-black text-black caret-black ${
                      emailError ? "border-red-500" : ""
                    }`}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError("");
                    }}
                  />
                  {emailError && (
                    <span className="text-red-500 text-sm mt-1">
                      {emailError}
                    </span>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSubmission}
                    className="w-full sm:w-fit px-6 py-2 font-medium border-2 border-black bg-white text-black transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormCompleteModal;
