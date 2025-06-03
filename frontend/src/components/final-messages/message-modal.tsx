import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

export const MessageModalWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div onClick={() => setIsOpen(true)}>
      {children}
      <MessageModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

const MessageModal = ({ isOpen, setIsOpen }) => {
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
        <div className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll">
          <motion.div
            ref={modalRef}
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            className="bg-white text-black p-8 w-full max-w-lg shadow-xl cursor-default relative overflow-hidden border-[3px] h-3/4 border-black"
          >
            {/* Envelope flap decoration */}
            <div className="absolute -top-8 left-0 right-0 h-16 bg-pink-100 border-b-[3px] border-black transform -skew-y-3 origin-left"></div>

            {/* Letter content */}
            <div className="relative z-10 mt-4">
              <div className="bg-white p-6 relative">
                {/* Decorative stamp corner */}
                <div className="absolute top-1 right-1 w-16 h-16 border-2 border-black/20 rounded-sm flex items-center justify-center bg-pink-50/50 rotate-6"></div>
              </div>
            </div>
            <div className="text-black text-sm tracking-wide mt-10 h-9/12 overflow-y-scroll">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nobis
              nesciunt quaerat nostrum? Pariatur tempore facere, fugit tenetur
              magni sed consequatur! Lorem ipsum dolor sit amet consectetur
              adipisicing elit. Quisquam, quos. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Nobis nesciunt quaerat nostrum?
              Pariatur tempore facere, fugit tenetur magni sed consequatur!
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              quos. Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Nobis nesciunt quaerat nostrum? Pariatur tempore facere, fugit
              tenetur magni sed consequatur! Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Quisquam, quos. Lorem, ipsum dolor
              sit amet consectetur adipisicing elit. Nobis nesciunt quaerat
              nostrum? Pariatur tempore facere, fugit tenetur magni sed
              consequatur! Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quisquam, quos. Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. Nobis nesciunt quaerat nostrum? Pariatur tempore
              facere, fugit tenetur magni sed consequatur! Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Quisquam, quos. Lorem, ipsum
              dolor sit amet consectetur adipisicing elit. Nobis nesciunt
              quaerat nostrum? Pariatur tempore facere, fugit tenetur magni sed
              consequatur! Lorem ipsum dolor sit amet consectetur adipisicing
              elit. Quisquam, quos. Lorem, ipsum dolor sit amet consectetur
              adipisicing elit. Nobis nesciunt quaerat nostrum? Pariatur tempore
              facere, fugit tenetur magni sed consequatur! Lorem ipsum dolor sit
              amet consectetur adipisicing elit. Quisquam, quos.
            </div>

            {/* Decorative lines */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-pink-100/50"></div>
            <div className="absolute bottom-6 left-0 right-0 h-4 bg-pink-100/30"></div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MessageModal;
