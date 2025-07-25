"use client";

import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "@/components/memories/memories";
import { CharacterCard } from "@/components/character-card/character-card";
import SwipeablePages from "@/components/swipeable-pages/SwipeablePages";
import { FinalMessages } from "@/components/final-messages/final-messages";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BirthdayCardResponse } from "@/types/birthday-card";
import { MarqueeMemories } from "@/components/marquee/MarqueeMemories";

export default function Card() {
  const [showButtons, setShowButtons] = useState(false);
  const [birthdayCardResponse, setBirthdayCardResponse] =
    useState<BirthdayCardResponse | null>(null);
  const router = useRouter();
  const { birthdayCardUUID } = router.query;

  useEffect(() => {
    if (!router.isReady) return;

    if (!birthdayCardUUID) {
      console.log(JSON.stringify(router.query));
      console.log("No birthday card UUID found");
      return;
    }
    console.log(birthdayCardUUID);
    const fetchBirthdayCard = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/retrieve-birthday-card?cardUUID=${birthdayCardUUID}`
        );
        if (response.status === 200) {
          setBirthdayCardResponse(response.data);
          console.log(response.data);
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching birthday card:", error);
      }
    };

    fetchBirthdayCard();
  }, [router.isReady, birthdayCardUUID, router.query]);

  const memories = birthdayCardResponse?.memories.map((memory, index) => ({
    ...memory,
    tempId: index,
  }));
  //todo: add loading state
  return (
    <>
      <Head>
        <title>HAPPY BIRTHDAY!</title>
      </Head>
      {!birthdayCardResponse && (
        <div className="w-screen h-screen bg-pink-200 flex items-center justify-center p-2">
          <p className="text-3xl font-bold bg-white text-black border-2 border-black p-5">
            Hold on! We&apos;re fetching your birthday card...
          </p>
        </div>
      )}
      {birthdayCardResponse && (
        <SwipeablePages showButtons={showButtons}>
          <Countdown
            setShowButtons={setShowButtons}
            birthdayDateString={birthdayCardResponse?.birthdayDate}
          />
          <CharacterCard
            characterSummary={birthdayCardResponse?.summary}
            characterName={birthdayCardResponse?.characterName}
          />
          <Memories memories={memories} />
          <MarqueeMemories memories={memories} />
          <FinalMessages wishes={birthdayCardResponse?.wishes} />
        </SwipeablePages>
      )}
    </>
  );
}
