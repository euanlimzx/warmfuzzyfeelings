"use client";

import BirthdayWishForm from "@/components/question-form/BirthdayWishForm";
import { WarpBackground } from "@/components/magicui/warp-background";
import axios from "axios";
import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { birthdayCardUUID } = router.query;
  const [birthdayPerson, setBirthdayPerson] = useState("");
  const [isCardRetrievalError, setIsCardRetrievalError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!birthdayCardUUID) {
      setIsLoading(false);
      return;
    }

    const cardResponse = async () => {
      try {
        const card = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/get-card-from-uuid?cardUUID=${birthdayCardUUID}`
        );

        if (card.status === 200) {
          setBirthdayPerson(card.data.card.birthdayPerson);
        } else {
          setIsCardRetrievalError(true);
        }
      } catch (error) {
        setIsCardRetrievalError(true);
      } finally {
        setIsLoading(false);
      }
    };
    cardResponse();
  }, [birthdayCardUUID]);

  if (isLoading || !birthdayCardUUID) {
    return (
      <div className="text-black flex flex-col items-center justify-center w-full min-h-screen bg-white p-4">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Make a Wish</title>
      </Head>
      <div className="text-black flex flex-col items-center justify-center w-full min-h-screen bg-white p-4">
        <WarpBackground className="w-full max-w-2xl">
          {!isCardRetrievalError ? (
            <BirthdayWishForm
              cardUUID={birthdayCardUUID as string}
              birthdayPerson={birthdayPerson}
            />
          ) : (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-medium bg-white z-10 opacity-100 border-2 border-black p-4">
              Hmm... we cant really seem to find the person you&apos;re looking
              for
            </div>
          )}
        </WarpBackground>
      </div>
    </>
  );
}
