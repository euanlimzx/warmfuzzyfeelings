import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { motion } from "framer-motion";
import WaitlistButton from "./waitlist-button";

export const LandingPage = () => {
  return (
    // <section className="overflow-hidden bg-white h-screen flex flex-col justify-between">
    <section className="overflow-hidden bg-white h-screen flex flex-col justify-between bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] md:bg-none bg-[size:4rem_4rem]">
      <TickerTop />
      <div className="relative flex flex-col items-center justify-center px-12 pb-48 pt-12 md:pt-24">
        <Copy />
      </div>
      <TickerBottom />
    </section>
  );
};

const Copy = () => {
  return (
    <>
      <div className="mb-7 rounded-full bg-zinc-600">
        <a
          href="#"
          target="_blank"
          rel="nofollow"
          className="flex origin-top-left items-center rounded-full border border-zinc-900 bg-white p-0.5 text-sm transition-transform hover:-rotate-2"
        >
          <span className="rounded-full bg-red-500 px-2 py-0.5 text-md text-white">
            ALPHA VER.
          </span>
          <span className="ml-1.5 mr-1 inline-block">Give us feedback!</span>
          <FiArrowUpRight className="mr-2 inline-block" />
        </a>
      </div>
      <h1 className="max-w-4xl text-center font-black leading-[1.15] text-5xl md:text-7xl md:leading-[1.15]">
        GROUP HUGS, NOW AS A CARD.
      </h1>
      <p className="mx-auto my-4 max-w-3xl text-center text-base leading-relaxed md:my-6 md:text-2xl md:leading-relaxed">
        Easily create fun, collaborative birthday cards in seconds - just share
        a link and watch the messages roll in.
      </p>
      <WaitlistButton />
    </>
  );
};

const TickerTop = () => {
  return (
    <div className="relative scale-[1.01] border-y-4 border-red-600 bg-white">
      <div className="relative z-0 flex overflow-hidden">
        <TranslateWrapper>
          <TickerItemsCopy />
        </TranslateWrapper>
        <TranslateWrapper>
          <TickerItemsCopy />
        </TranslateWrapper>
        <TranslateWrapper>
          <TickerItemsCopy />
        </TranslateWrapper>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-white to-white/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-white to-white/0" />
    </div>
  );
};

const TickerBottom = () => {
  return (
    <div className="relative -mt-2 scale-[1.01] border-y-4 border-red-600 bg-white">
      <div className="relative z-0 flex overflow-hidden">
        <TranslateWrapper reverse>
          <TickerItemsCopy />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <TickerItemsCopy />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <TickerItemsCopy />
        </TranslateWrapper>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-32 bg-gradient-to-r from-white to-white/0" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-32 bg-gradient-to-l from-white to-white/0" />
    </div>
  );
};

const TranslateWrapper = ({ children, reverse }) => {
  return (
    <motion.div
      initial={{ translateX: reverse ? "-100%" : "0%" }}
      animate={{ translateX: reverse ? "0%" : "-100%" }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="flex px-2"
    >
      {children}
    </motion.div>
  );
};

const TickerItem = ({ name }: { name: string }) => {
  return (
    <span className="flex items-center justify-center gap-4 px-4 py-2 md:py-4">
      <span className="whitespace-nowrap text-xl font-semibold uppercase md:text-2xl text-red-600">
        {name}
      </span>
    </span>
  );
};

const TickerItemsCopy = () => (
  <>
    <TickerItem name="Everyone deserves to know how valued they are" />
    <TickerItem name="|" />
    <TickerItem name="Tell that special someone how much they mean to you" />
    <TickerItem name="|" />
    <TickerItem name="The happiest birthdays all start with a personal touch" />
    <TickerItem name="|" />
    <TickerItem name="Memories mean more when shared" />
    <TickerItem name="|" />
    <TickerItem name="Because appreciation shouldn't be left unsaid" />
    <TickerItem name="|" />
    <TickerItem name="Less awkward than a group Zoom call, more fun than a solo text" />
    <TickerItem name="|" />
  </>
);
