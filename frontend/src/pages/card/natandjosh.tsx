"use client";

import SwipeablePages from "@/components/swipeable-pages/SwipeablePages";
import { FinalMessages } from "@/components/final-messages/final-messages";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "axios";
import { WeddingCardResponse } from "@/types/birthday-card";
import { Memories } from "@/components/memories/memories";

export default function Card() {
  const [showButtons] = useState(false);
  const [birthdayCardResponse, setBirthdayCardResponse] =
    useState<WeddingCardResponse | null>(null);

  useEffect(() => {
    const fetchBirthdayCard = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/retrieve-wedding-card-nj?password=happyW3ddinG!`
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
  }, []);

//   const memories = birthdayCardResponse?.memories.map((memory, index) => ({
//     ...memory,
//     tempId: index,
//   }));
  //todo: add loading state
  return (
    <>
      <Head>
        <title>HAPPY WEDDING!</title>
      </Head>
      {!birthdayCardResponse && (
        <div className="w-screen h-screen bg-pink-200 flex items-center justify-center p-2">
          <p className="text-3xl font-bold bg-white text-black border-2 border-black p-5">
            Hold on! We&apos;re fetching your wedding card...
          </p>
        </div>
      )}
      {birthdayCardResponse && (
        <SwipeablePages showButtons={showButtons}>
          {/* <Countdown
            setShowButtons={setShowButtons}
            birthdayDateString={birthdayCardResponse?.birthdayDate}
          /> */}
          <Memories images={birthdayCardResponse?.imageUrls.filter(image => image !== null)} />
          <FinalMessages wishes={birthdayCardResponse?.finalMessage?.filter(wish => wish !== null) || []} />
        </SwipeablePages>
      )}
    </>
  );
}
