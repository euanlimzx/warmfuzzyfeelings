import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "@/components/memories/memories";
import { CharacterCard } from "@/components/character-card/character-card";
import SwipeablePages from "@/components/swipeable-pages/SwipeablePages";
import { FinalMessages } from "@/components/final-messages/final-messages";
import Head from "next/head";
import { useState } from "react";

export default function Card() {
  const [showButtons, setShowButtons] = useState(false);

  return (
    <>
      <Head>
        <title>HAPPY BIRTHDAY!</title>
      </Head>
      <SwipeablePages showButtons={showButtons}>
        <Countdown setShowButtons={setShowButtons} />
        <CharacterCard />
        <Memories />
        <FinalMessages />
      </SwipeablePages>
    </>
  );
}
