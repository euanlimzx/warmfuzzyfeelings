"use client";

import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "@/components/memories/memories";
import { CharacterCard } from "@/components/character-card/character-card";
import SwipeablePages from "./DemoSwipablePages";
import { FinalMessages } from "@/components/final-messages/final-messages";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BirthdayCardResponse } from "@/types/birthday-card";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function DemoCard({
  birthdayCardUUID,
}: {
  birthdayCardUUID: string;
}) {
  const [showButtons, setShowButtons] = useState(false);
  const [birthdayCardResponse, setBirthdayCardResponse] =
    useState<BirthdayCardResponse | null>(null);
  const swipeUpFunctionRef = useRef<null | (() => void)>(null);
  const swipeDownFunctionRef = useRef<null | (() => void)>(null);

  useEffect(() => {
    if (!birthdayCardUUID) {
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
  }, [birthdayCardUUID]);

  // hook to initialize driver.js
  useEffect(() => {
    // initialize only after the initial animation is complete
    if (!showButtons) {
      return;
    }

    const initializeDriver = () => {
      // Check if the function is available before initializing driver
      if (!swipeDownFunctionRef.current) {
        console.log("Waiting for swipeDownFunctionRef...");
        setTimeout(initializeDriver, 500);
        return;
      }

      const driverObj = driver({
        steps: [
          {
            element: "#card-pagination-buttons",
            popover: {
              title: "This is a test",
              description: "Hehe haha",
              onNextClick: () => {
                if (swipeUpFunctionRef.current) {
                  swipeUpFunctionRef.current();
                }
                setTimeout(() => driverObj.moveNext(), 1);
              },
            },
          },
          {
            element: "#character-description",
            popover: { title: "hehe", description: "haha" },
          },
          {
            element: "#first-character-definition",
            popover: {
              title: "hoho",
              description: "haha",
              onNextClick: () => {
                if (swipeUpFunctionRef.current) {
                  swipeUpFunctionRef.current();
                }
                setTimeout(() => driverObj.moveNext(), 1);
              },
            },
          },

          {
            element: "#first-paged-memory-card",
            popover: {
              title: "hoho",
              description: "haha",
              onNextClick: () => {
                if (swipeUpFunctionRef.current) {
                  swipeUpFunctionRef.current();
                }
                setTimeout(() => driverObj.moveNext(), 1);
              },
            },
          },
          {
            element: "#final-message-box",
            popover: {
              title: "hoho",
              description: "haha",
            },
          },
        ],
      });

      driverObj.drive();
    };

    setTimeout(initializeDriver, 1000);
  }, [showButtons]);

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
        <SwipeablePages
          showButtons={showButtons}
          swipeDownFunctionRef={swipeDownFunctionRef}
          swipeUpFunctionRef={swipeUpFunctionRef}
        >
          <Countdown
            setShowButtons={setShowButtons}
            birthdayDateString={birthdayCardResponse?.birthdayDate}
          />
          <CharacterCard
            characterSummary={birthdayCardResponse?.summary}
            characterName={birthdayCardResponse?.characterName}
          />
          <Memories memories={memories} />
          <FinalMessages wishes={birthdayCardResponse?.wishes} />
        </SwipeablePages>
      )}
    </>
  );
}
