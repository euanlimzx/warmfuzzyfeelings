"use client";

import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "./DemoMemories";
import { CharacterCard } from "./DemoCharacterCard";
import SwipeablePages from "./DemoSwipablePages";
import { FinalMessages } from "@/components/final-messages/final-messages-demo";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BirthdayCardResponse } from "@/types/birthday-card";
import {
  Driver,
  driver,
  DriveStep,
  PopoverDOM,
  State,
  Config,
} from "driver.js";
import "driver.js/dist/driver.css";
import React from "react";

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
  const driverRef = useRef<null | Driver>(null);

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
      if (!swipeDownFunctionRef.current || !swipeUpFunctionRef.current) {
        return;
      }

      const handlePopoverNextClick = () => {
        if (swipeUpFunctionRef.current) {
          swipeUpFunctionRef.current();
        }
        setTimeout(() => driverObj.moveNext(), 10);
      };

      const handlePopoverPrevClick = () => {
        if (swipeDownFunctionRef.current) {
          swipeDownFunctionRef.current();
        }

        setTimeout(() => driverObj.movePrevious(), 10);
      };

      const setPopOverStyles = (
        popover: PopoverDOM,
        { driver, state }: { driver: Driver; state: State }
      ) => {
        console.log(state);

        const {
          nextButton,
          previousButton,
          title,
          description,
          wrapper,
          closeButton,
        } = popover;

        nextButton.innerText = "";
        nextButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          `;

        previousButton.innerText = "";
        previousButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          `;

        closeButton.innerText = "";
        closeButton.innerHTML = `
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>`;

        nextButton.classList.add("neo-brutalist-next-btn");
        previousButton.classList.add("neo-brutalist-prev-btn");
        title.classList.add("neo-brutalist-popover-title");
        description.classList.add("neo-brutalist-popover-text");
        wrapper.classList.add("neo-brutalist-popover-modal");
        closeButton.classList.add("neo-brutalist-close-button");
      };

      const driverObj = driver({
        onPopoverRender: setPopOverStyles,
        steps: [
          {
            element: "#card-pagination-buttons",
            popover: {
              description:
                "Use these buttons to move around on your card! Click the 'down' button to check out your card",
              onNextClick: handlePopoverNextClick,
              onPopoverRender: (popover, { state, driver }) => {
                setPopOverStyles(popover, { state, driver });
                popover.footerButtons.style.position = "absolute";
                popover.footerButtons.style.visibility = "hidden";
              },
            },
          },

          {
            element: "#character-description",
            popover: {
              description:
                "Click on the underlined words to see who said these lovely things about you!",
              onPopoverRender: (popover, { driver, state }) => {
                setPopOverStyles(popover, { driver, state });
                driver.setConfig({
                  ...driver.getConfig(),
                  stagePadding: 30,
                });
                const bindingBox = document.querySelector(
                  "#step-5-binding-div"
                );
                if (bindingBox instanceof HTMLElement) {
                  bindingBox.style.setProperty(
                    "overflow",
                    "visible",
                    "important"
                  );
                }
              },
              onNextClick: (
                element: Element | undefined,
                step: DriveStep,
                { driver }: { config: Config; state: State; driver: Driver }
              ) => {
                if (driver) {
                  driver.setConfig({
                    ...driver.getConfig(),
                    stagePadding: 10,
                  });
                }
                handlePopoverNextClick();
              },
              onPrevClick: handlePopoverPrevClick,
            },
          },

          {
            element: "#first-paged-memory-card",
            popover: {
              description:
                "You're now at the memory card! Tap on this image to bring it into focus",
              onNextClick: () => {
                driverObj.moveNext();
              },
              onPrevClick: handlePopoverPrevClick,
              onPopoverRender: (popover, { state, driver }) => {
                setPopOverStyles(popover, { state, driver });
                popover.footerButtons.style.position = "absolute";
                popover.footerButtons.style.visibility = "hidden";
              },
            },
          },
          {
            element: "#second-paged-memory-card",
            popover: {
              description:
                "then tap here to bring the previous image into focus",
              onNextClick: () => {
                setTimeout(() => handlePopoverNextClick(), 350);
              },
              onPrevClick: () => {
                driverObj.movePrevious();
              },
              onPopoverRender: (popover, { state, driver }) => {
                setPopOverStyles(popover, { state, driver });
                popover.footerButtons.style.position = "absolute";
                popover.footerButtons.style.visibility = "hidden";
              },
            },
          },
          {
            element: "#final-message-box",
            popover: {
              description:
                "Your friends have also left some final messages for you! Click on the bouncing bubbles to see what they've said!",
              onPrevClick: () => {
                handlePopoverPrevClick();
                handlePopoverPrevClick();
              },
            },
          },
        ],
        overlayClickBehavior: undefined,
      });

      driverRef.current = driverObj;
      driverObj.drive();
    };

    setTimeout(initializeDriver, 100);
  }, [showButtons, swipeDownFunctionRef, swipeUpFunctionRef]);

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
          driverRef={driverRef}
        >
          <Countdown
            setShowButtons={setShowButtons}
            birthdayDateString={birthdayCardResponse?.birthdayDate}
          />
          <CharacterCard
            characterSummary={birthdayCardResponse?.summary}
            characterName={birthdayCardResponse?.characterName}
          />
          <Memories memories={memories} driverRef={driverRef} />
          <FinalMessages
            wishes={birthdayCardResponse?.wishes}
            driverRef={driverRef}
          />
        </SwipeablePages>
      )}
    </>
  );
}
