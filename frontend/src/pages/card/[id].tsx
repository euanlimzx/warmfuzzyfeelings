import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "@/components/memories/memories";
import { CharacterCard } from "@/components/character-card/character-card";
import SwipeablePages from "@/components/swipeable-pages/SwipeablePages";
import { FinalMessages } from "@/components/final-messages/final-messages";
import Head from "next/head";

export default function Card() {
  return (
    <>
      <Head>
        <title>HAPPY BIRTHDAY!</title>
      </Head>
      <SwipeablePages>
        <FinalMessages />
        <Countdown />
        <CharacterCard />
        <Memories />
      </SwipeablePages>
    </>
  );
}
