// todo @ euan:
// - figure out how many words max
// - prevent text from squeezing images
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { GoArrowLeft, GoArrowRight, GoChevronDown } from "react-icons/go";
import Image from "next/image";

const CARD_SIZE_LG = 300;
const CARD_SIZE_SM = 250;

const BORDER_SIZE = 2;

const ROTATE_DEG = 2.5;

const STAGGER = 15;
const CENTER_STAGGER = -55;

const SECTION_HEIGHT = "100vh";

export const Memories = () => {
  const [cardSize, setCardSize] = useState(CARD_SIZE_LG);

  const [testimonials, setTestimonials] = useState(TESTIMONIAL_DATA);

  const handleMove = (position) => {
    const copy = [...testimonials];

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

    setTestimonials(copy);
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
      className="relative w-full overflow-hidden min-h-full bg-red-500"
      style={{
        height: SECTION_HEIGHT,
      }}
    >
      <h2 className="text-center font-semibold text-2xl py-10 mt-10 mx-auto">
        You&apos;ve shared countless of memories with everyone, but here are the
        ones we&apos;ll remember forever
      </h2>
      <div className="relative h-[80%] w-full">
        {testimonials.map((t, idx) => {
          let position = 0;

          if (testimonials.length % 2) {
            position = idx - (testimonials.length + 1) / 2;
          } else {
            position = idx - testimonials.length / 2;
          }

          return (
            <TestimonialCard
              key={t.tempId}
              testimonial={t}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
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

const TestimonialCard = ({ position, testimonial, handleMove, cardSize }) => {
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
  }, [testimonial.testimonial]);

  return (
    <motion.div
      initial={false}
      onClick={() => handleMove(position)}
      className={`
      absolute left-1/2 top-1/2 cursor-pointer border-black bg-white p-4 text-black transition-colors duration-500 bg flex flex-col items-center ${
        isActive ? "z-10" : "z-0"
      }
      `}
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
    >
      <div className="flex flex-col items-center h-full w-full relative">
        <div className="relative h-60 w-60 sm:h-75 sm:w-75 mb-2">
          <Image
            src={"https://picsum.photos/500/800"}
            alt={`Testimonial image for ${testimonial.by}`}
            fill
            className="object-cover border-[2px] border-black"
            style={{
              boxShadow: "2px 2px 0px white",
            }}
          />
        </div>
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
            &ldquo;{testimonial.testimonial}&rdquo;
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
        )}
      </div>
    </motion.div>
  );
};

const TESTIMONIAL_DATA = [
  {
    tempId: 0,
    testimonial:
      "My favorite solution in the market. We work 5x faster with COMPANYMy favorite solution in the market. We work 5x faster with COMPANYMy favorite solution in the market. We work 5x faster with COMPANYMy favorite solution in the market. We work 5x faster with COMPANYMy favorite solution in the market. We work 5x faster with COMPANYMy favorite solution in the market. We work 5x faster with COMPANYMy favorite solution in the market. We work 5x faster with COMPANY.",
    by: "Alex, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/1.jpg",
  },
  {
    tempId: 1,
    testimonial:
      "I'm confident my data is safe with COMPANY. I can't say that about other providers.",
    by: "Dan, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/2.jpg",
  },
  {
    tempId: 2,
    testimonial:
      "I know it's cliche, but we were lost before we found COMPANY. Can't thank you guys enough!",
    by: "Stephanie, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/3.jpg",
  },
  {
    tempId: 3,
    testimonial:
      "COMPANY's products make planning for the future seamless. Can't recommend them enough!",
    by: "Marie, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/4.jpg",
  },
  {
    tempId: 4,
    testimonial: "If I could give 11 stars, I'd give 12.",
    by: "Andre, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/5.jpg",
  },
  {
    tempId: 5,
    testimonial:
      "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.",
    by: "Jeremy, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/6.jpg",
  },
  {
    tempId: 6,
    testimonial:
      "Took some convincing, but now that we're on COMPANY, we're never going back.",
    by: "Pam, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/7.jpg",
  },
  {
    tempId: 7,
    testimonial:
      "I would be lost without COMPANY's in depth analytics. The ROI is EASILY 100X for us.",
    by: "Daniel, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/8.jpg",
  },
  {
    tempId: 8,
    testimonial: "It's just the best. Period.",
    by: "Fernando, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/9.jpg",
  },
  {
    tempId: 9,
    testimonial: "I switched 5 years ago and never looked back.",
    by: "Andy, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/10.jpg",
  },
  {
    tempId: 10,
    testimonial:
      "I've been searching for a solution like COMPANY for YEARS. So glad I finally found one!",
    by: "Pete, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/11.jpg",
  },
  {
    tempId: 11,
    testimonial:
      "It's so simple and intuitive, we got the team up to speed in 10 minutes.",
    by: "Marina, CEO at COMPANY",
    imgSrc: "/imgs/head-shots/12.jpg",
  },
];
