import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import {
  FiBell,
  FiCheck,
  FiChevronDown,
  FiList,
  FiMessageCircle,
  FiUser,
} from "react-icons/fi";
import { motion } from "framer-motion";
import {
  SiNike,
  Si3M,
  SiAbstract,
  SiAdobe,
  SiAirtable,
  SiAmazon,
  SiBox,
  SiBytedance,
  SiChase,
  SiCloudbees,
  SiBurton,
  SiBmw,
  SiHeroku,
  SiBuildkite,
  SiCouchbase,
  SiDailymotion,
  SiDeliveroo,
  SiEpicgames,
  SiGenius,
  SiGodaddy,
} from "react-icons/si";

export const LandingPage = () => {
  return (
    <section className="overflow-hidden bg-white ">
      <div className="relative flex flex-col items-center justify-center px-12 pb-48 pt-12 md:pt-24">
        <Copy />
      </div>
      <Logos />
    </section>
  );
};

const Copy = () => {
  return (
    <>
      <div className="mb-1.5 rounded-full bg-zinc-600">
        <a
          href="#"
          target="_blank"
          rel="nofollow"
          className="flex origin-top-left items-center rounded-full border border-zinc-900 bg-white p-0.5 text-sm transition-transform hover:-rotate-2"
        >
          <span className="rounded-full bg-[#FF6154] px-2 py-0.5 font-medium text-white">
            ALPHA VER.
          </span>
          <span className="ml-1.5 mr-1 inline-block">Give us feedback!</span>
          <FiArrowUpRight className="mr-2 inline-block" />
        </a>
      </div>
      <h1 className="max-w-4xl text-center text-4xl font-black leading-[1.15] md:text-6xl md:leading-[1.15]">
        GROUP BIRTHDAY CARDS MADE SIMPLE.
      </h1>
      <p className="mx-auto my-4 max-w-3xl text-center text-base leading-relaxed md:my-6 md:text-xl md:leading-relaxed">
        Easily create fun, collaborative birthday cards for those who you love
        the most.
      </p>
      <button className="rounded-lg bg-indigo-600 p-3 uppercase text-white transition-colors hover:bg-indigo-700">
        <span className="font-bold">JOIN THE WAITLIST</span>
      </button>
    </>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <svg
      width="32"
      height="auto"
      viewBox="0 0 50 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-fit fill-zinc-950"
    >
      <path
        d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
        stopColor="#09090B"
      ></path>
      <path
        d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
        stopColor="#09090B"
      ></path>
    </svg>
  );
};

const Logos = () => {
  return (
    <div className="relative -mt-2 -rotate-1 scale-[1.01] border-y-2 border-zinc-900 bg-white">
      <div className="relative z-0 flex overflow-hidden border-b-2 border-zinc-900">
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
        <TranslateWrapper>
          <LogoItemsTop />
        </TranslateWrapper>
      </div>
      <div className="relative z-0 flex overflow-hidden">
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
        </TranslateWrapper>
        <TranslateWrapper reverse>
          <LogoItemsBottom />
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

const LogoItem = ({ Icon, name }) => {
  return (
    <span className="flex items-center justify-center gap-4 px-4 py-2 md:py-4">
      <Icon className="text-2xl text-indigo-600 md:text-3xl" />
      <span className="whitespace-nowrap text-xl font-semibold uppercase md:text-2xl">
        {name}
      </span>
    </span>
  );
};

const LogoItemsTop = () => (
  <>
    <LogoItem Icon={SiNike} name="Nike" />
    <LogoItem Icon={Si3M} name="3M" />
    <LogoItem Icon={SiAbstract} name="Abstract" />
    <LogoItem Icon={SiAdobe} name="Adobe" />
    <LogoItem Icon={SiAirtable} name="Airtable" />
    <LogoItem Icon={SiAmazon} name="Amazon" />
    <LogoItem Icon={SiBox} name="Box" />
    <LogoItem Icon={SiBytedance} name="Bytedance" />
    <LogoItem Icon={SiChase} name="Chase" />
    <LogoItem Icon={SiCloudbees} name="Cloudebees" />
  </>
);

const LogoItemsBottom = () => (
  <>
    <LogoItem Icon={SiBmw} name="BMW" />
    <LogoItem Icon={SiBurton} name="Burton" />
    <LogoItem Icon={SiBuildkite} name="Buildkite" />
    <LogoItem Icon={SiCouchbase} name="Couchbase" />
    <LogoItem Icon={SiDailymotion} name="Dailymotion" />
    <LogoItem Icon={SiDeliveroo} name="deliveroo" />
    <LogoItem Icon={SiEpicgames} name="Epic Games" />
    <LogoItem Icon={SiGenius} name="Genius" />
    <LogoItem Icon={SiGodaddy} name="GoDaddy" />
    <LogoItem Icon={SiHeroku} name="Heroku" />
  </>
);
