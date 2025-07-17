import { Ripple } from "@/components/magicui/ripple";
import React, { useState, ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WordWithSource } from "@/types/birthday-card";

export function CharacterCard({
  characterSummary,
  characterName,
}: {
  characterSummary: WordWithSource[];
  characterName: string;
}) {
  // Popup state
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-blue-300">
      {/* Blurred background overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-700 pointer-events-none ${
          showPopup ? "opacity-100 backdrop-blur-sm" : "opacity-0 backdrop-blur-none"
        }`}
      />
      {/* Temporary popup */}
      <div
        className={`fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 pointer-events-none ${
          showPopup ? "opacity-100" : "opacity-0"
        }`}
        style={{ minWidth: 320 }}
      >
        <div className="bg-white text-black border-2 border-black px-8 py-4 shadow-xl text-center text-2xl font-semibold max-w-lg">
          You&apos;re a star! Click on the underlined words to see what people have been saying about you
        </div>
      </div>
      {/* End popup */}
      {/* Main content */}
      <div className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
        <DictionaryCard
          characterSummary={characterSummary}
          characterName={characterName}
        />
      </div>
      <Ripple />
    </div>
  );
}

export default function DictionaryCard({
  characterSummary,
  characterName,
}: {
  characterSummary: WordWithSource[];
  characterName: string;
}) {
  return (
    <div className="flex justify-center p-6 text-black">
      <div className="relative w-full max-w-md">
        {/* Neo-brutalist decorative elements */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-purple-300 rotate-12 border-2 border-black"></div>
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-black"></div>

        {/* Main card */}
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Word and pronunciation */}
          <div className="mb-4 border-b-4 border-black pb-2">
            <h1 className="font-mono text-4xl font-black lowercase">
              {characterName}
            </h1>
          </div>

          {/* Definition */}
          <div className="font-mono text-base leading-relaxed tracking-wide">
            {characterSummary.map((word) => {
              if (word.sources.length > 0) {
                const FlyoutContent = () => {
                  return (
                    <FlyoutWrapper>
                      {word.sources.map((source) => (
                        <div key={source.author}>
                          {source.author} said: {source.message}
                        </div>
                      ))}
                    </FlyoutWrapper>
                  );
                };
                return (
                  <FlyoutLink key={word.word} FlyoutContent={FlyoutContent}>
                    {word.word + " "}
                  </FlyoutLink>
                );
              } else {
                return word.word + " ";
              }
            })}
          </div>

          {/* Neo-brutalist stamp */}
          <div className="absolute -rotate-12 top-2 right-2">
            <div className="border-2 h-10 w-10 border-black bg-yellow-300 text-white text-xs font-bold py-1 px-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface FlyoutLinkProps {
  children: ReactNode;
  FlyoutContent: React.FC;
}

const FlyoutLink = ({ children, FlyoutContent }: FlyoutLinkProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      console.log("outside clicked");
      setOpen(false);
    };

    if (open) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const showFlyout = open;

  return (
    <span
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={handleClick}
      className="relative inline-block cursor-pointer"
    >
      <span className="relative inline-flex items-center underline underline-offset-2 decoration-2">
        {children}
        <span
          style={{
            transform: showFlyout ? "scaleX(1)" : "scaleX(0)",
          }}
          className="absolute -bottom-1 -left-1 -right-1 h-1 origin-left scale-x-0 rounded-full bg-indigo-300 transition-transform duration-300 ease-out"
        />
      </span>
      <AnimatePresence>
        {showFlyout && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{ translateX: "-50%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute left-1/2 top-12 bg-white text-black z-50"
          >
            <div className="absolute -top-6 left-0 right-0 h-6 bg-transparent" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 border-l-2 border-t-2 border-black bg-white z-60" />
            <FlyoutContent />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
};

const FlyoutWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-64 bg-white p-6 shadow-2xl border-2 border-black z-20">
      <div className="mb-3 space-y-3 text-sm">{children}</div>
    </div>
  );
};
