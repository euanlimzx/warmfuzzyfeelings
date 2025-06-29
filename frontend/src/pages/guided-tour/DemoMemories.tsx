import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { GoArrowLeft, GoArrowRight, GoChevronDown } from "react-icons/go";
import Image from "next/image";
import { DemoMemory, Memory } from "@/types/birthday-card";
import { driver, Driver } from "driver.js";

const CARD_SIZE_LG = 300;
const CARD_SIZE_SM = 250;

const BORDER_SIZE = 2;

const ROTATE_DEG = 2.5;

const STAGGER = 15;
const CENTER_STAGGER = -55;

const SECTION_HEIGHT = "100vh";

// REMOVE LATER, TEMP FLAG TO DISPLAY TEXT OR NOT
const SHOW_TEXT = false;

export const Memories = ({
  memories,
  driverRef,
}: {
  memories: DemoMemory[];
  driverRef: React.RefObject<null | Driver>;
}) => {
  const [cardSize, setCardSize] = useState(CARD_SIZE_LG);

  const createFlattenedTestimonials = (memories: Memory[]) => {
    return memories.flatMap((memory, memoryIdx) =>
      memory.imageUrls.map((imageUrl, imageIdx) => ({
        ...memory,
        imageUrl,
        uniqueId: `${memoryIdx}-${imageIdx}`, // Unique identifier
        tempId: Math.random(), // For animation key
      }))
    );
  };

  const tempFlatTestimonials = createFlattenedTestimonials(memories);

  let desiredPositionOffset;
  if (tempFlatTestimonials.length % 2) {
    desiredPositionOffset = (tempFlatTestimonials.length + 1) / 2;
  } else {
    desiredPositionOffset = tempFlatTestimonials.length / 2;
  }

  const [flattenedTestimonials, setFlattenedTestimonials] = useState(() =>
    tempFlatTestimonials.map((memory, idx) => ({
      ...memory,
      isFirstDemoImage: idx === 1 + desiredPositionOffset,
      isSecondDemoImage: idx === 0 + desiredPositionOffset,
    }))
  );

  const handleMove = (position: number) => {
    const copy = [...flattenedTestimonials];

    if (position > 0) {
      for (let i = position; i > 0; i--) {
        const firstEl = copy.shift();
        if (!firstEl) return;
        copy.push({ ...firstEl, tempId: Math.random() });
      }
    } else {
      for (let i = position; i < 0; i++) {
        const lastEl = copy.pop();
        if (!lastEl) return;
        copy.unshift({ ...lastEl, tempId: Math.random() });
      }
    }

    setFlattenedTestimonials(copy);
  };

  useEffect(() => {
    const { matches } = window.matchMedia("(min-width: 640px)");

    if (matches) {
      setCardSize(CARD_SIZE_LG);
    } else {
      setCardSize(CARD_SIZE_SM);
    }

    const handleSetCardSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");

      if (matches) {
        setCardSize(CARD_SIZE_LG);
      } else {
        setCardSize(CARD_SIZE_SM);
      }
    };

    window.addEventListener("resize", handleSetCardSize);

    return () => window.removeEventListener("resize", handleSetCardSize);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden min-h-full bg-yellow-400"
      style={{
        height: SECTION_HEIGHT,
      }}
    >
      {/* todo: outline the text in the h2 component */}
      <h2 className="text-center font-medium text-2xl text-black py-10 mt-10 mx-auto">
        You&apos;ve shared countless of memories with everyone, but here are the
        ones we&apos;ll remember forever
      </h2>
      <div className="relative h-[80%] w-full">
        {flattenedTestimonials.map((item, currentIdx) => {
          let position = 0;
          if (flattenedTestimonials.length % 2) {
            position = currentIdx - (flattenedTestimonials.length + 1) / 2;
          } else {
            position = currentIdx - flattenedTestimonials.length / 2;
          }

          return (
            <TestimonialCard
              key={item.tempId}
              testimonial={item}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
              imageUrl={item.imageUrl}
              isFirstDemoImage={item.isFirstDemoImage}
              isSecondDemoImage={item.isSecondDemoImage}
              driverRef={
                item.isFirstDemoImage || item.isSecondDemoImage
                  ? driverRef
                  : null
              }
            />
          );
        })}
        <div className="absolute bottom-4 left-1/2 hidden md:flex -translate-x-1/2 gap-8">
          <button
            onClick={() => handleMove(-1)}
            className="grid h-14 w-14 place-content-center text-3xl transition-colors hover:bg-red-400 hover:text-white"
          >
            <GoArrowLeft />
          </button>
          <button
            onClick={() => handleMove(1)}
            className="grid h-14 w-14 place-content-center text-3xl transition-colors hover:bg-red-400 hover:text-white"
          >
            <GoArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({
  position,
  testimonial,
  handleMove,
  cardSize,
  imageUrl,
  isFirstDemoImage,
  isSecondDemoImage,
  driverRef,
}: {
  position: number;
  testimonial: string;
  handleMove: (position: number) => void;
  cardSize: number;
  imageUrl: string;
  isFirstDemoImage: boolean;
  isSecondDemoImage: boolean;
  driverRef: React.RefObject<null | Driver>;
}) => {
  const isActive = position === 0;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTextTruncated, setIsTextTruncated] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (textRef.current) {
      const isOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight;
      setIsTextTruncated(isOverflowing);
    }
  }, [testimonial.memory]);

  return (
    <motion.div
      initial={false}
      onClick={() => {
        handleMove(position);

        if (driverRef?.current) {
          if (isFirstDemoImage) {
            const currentEl = document.querySelector(
              "#second-paged-memory-card"
            );
            if (currentEl instanceof HTMLElement) {
              currentEl.style.pointerEvents = "auto";
              currentEl.addEventListener("click", () => {
                const nextButton = document.querySelector(
                  ".neo-brutalist-next-btn"
                );
                if (nextButton instanceof HTMLButtonElement) {
                  nextButton.click();
                  driverRef?.current?.moveTo(
                    driverRef?.current?.getActiveIndex() as number
                  );
                  driverRef.current?.refresh();
                }
              });
              driverRef.current.moveNext();
            }
          }
        }
      }}
      className={`      absolute left-1/2 top-1/2 cursor-pointer border-black bg-white p-4 text-black transition-colors duration-500 flex flex-col items-center ${
        isActive ? "z-10" : "z-0"
      } ${SHOW_TEXT ? "" : "pt-16"} ${isSecondDemoImage ? "z-5" : ""}`}
      style={{
        borderWidth: BORDER_SIZE,
      }}
      animate={{
        width: isActive ? cardSize * 1.1 : cardSize,
        height: isActive
          ? isExpanded
            ? cardSize * 2
            : cardSize * 1.6
          : cardSize * 1.6,
        x: `calc(-50% + ${position * (cardSize / 1.1)}px)`,
        y: `calc(-50% + ${
          isActive ? CENTER_STAGGER : position % 2 ? STAGGER : -STAGGER
        }px)`,
        rotate: isActive ? 0 : position % 2 ? ROTATE_DEG : -ROTATE_DEG,
        boxShadow: "0px 0px 0px 0px black",
      }}
      transition={{
        type: "spring",
        mass: 3,
        stiffness: 400,
        damping: 50,
      }}
      id={`${
        isFirstDemoImage
          ? "first-paged-memory-card"
          : isSecondDemoImage
          ? "second-paged-memory-card"
          : ""
      }`}
    >
      <div
        className={`flex flex-col items-center ${
          isActive ? "h-60 w-60 sm:h-75 sm:w-75" : "h-50 w-50 sm:h-65 sm:w-65"
        } relative`}
      >
        <div
          className={`relative transition-all ${
            isActive ? "h-60 w-60 sm:h-75 sm:w-75" : "h-50 w-50 sm:h-65 sm:w-65"
          }`}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN}/${imageUrl}`}
            alt={`Testimonial image for ${testimonial.by}`}
            fill
            priority={true}
            loading="eager"
            className="object-cover border-[2px] border-black"
            style={{
              boxShadow: "2px 2px 0px white",
            }}
          />
        </div>
        {SHOW_TEXT ? (
          <>
            <div
              className={`w-full ${
                isActive && isExpanded
                  ? "h-[200px] overflow-y-auto"
                  : "overflow-hidden"
              }`}
            >
              <h3
                ref={textRef}
                className={`text-base sm:text-xl text-black text-center line-clamp-2 ${
                  isActive && isExpanded ? "line-clamp-none" : ""
                }`}
              >
                &ldquo;{testimonial.memory}&rdquo; - {testimonial.name}
              </h3>
            </div>
            {isActive && isTextTruncated && !isExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <GoChevronDown
                  className={`w-6 h-6 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}{" "}
          </>
        ) : (
          ""
        )}
      </div>
    </motion.div>
  );
};
