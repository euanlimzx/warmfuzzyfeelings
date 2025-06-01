"use client";

import BirthdayWishForm from "@/components/question-form/BirthdayWishForm";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { birthdayCardUUID } = router.query;

  return (
    <div className="text-white flex flex-col items-center justify-center w-full">
      <BirthdayWishForm cardUUID={birthdayCardUUID as string} />
    </div>
  );
}
