import { AnimatePresence, motion } from "framer-motion";
import { useRef, useEffect } from "react";
import CreateCardForm from "./create-card-form";

interface SpringModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SpringModal = ({ isOpen, setIsOpen }: SpringModalProps) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div
            ref={modalRef}
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className="w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
          >
            <CreateCardForm setIsOpen={setIsOpen} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SpringModal;
