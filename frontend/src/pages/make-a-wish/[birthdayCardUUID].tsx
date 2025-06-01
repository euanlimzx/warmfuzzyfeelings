"use client";

import BirthdayWishForm from "@/components/question-form/BirthdayWishForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { birthdayCardUUID } = router.query;
  const [birthdayPerson, setBirthdayPerson] = useState("");
  const [isCardRetrievalError, setIsCardRetrievalError] = useState(false);

  useEffect(() => {
    if (!birthdayCardUUID) return;

    const cardResponse = async () => {
      const card = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/get-card-from-uuid?cardUUID=${birthdayCardUUID}`
      );

      if (card.status === 200) {
        setBirthdayPerson(card.data.card.birthdayPerson);
      } else {
        setIsCardRetrievalError(true);
      }
    };
    cardResponse();
  }, [birthdayCardUUID]);

  return (
    <div className="text-black flex flex-col items-center justify-center w-full min-h-screen bg-white p-4">
      {!isCardRetrievalError ? (
        <div className="w-full max-w-2xl">
          <BirthdayWishForm
            cardUUID={birthdayCardUUID as string}
            birthdayPerson={birthdayPerson}
          />
        </div>
      ) : (
        <div>
          Hmm... we cant really seem to find the person you&apos;re looking for
        </div>
      )}
    </div>
  );
}
