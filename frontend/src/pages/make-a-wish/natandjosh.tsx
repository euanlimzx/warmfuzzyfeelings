"use client";

import { WarpBackground } from "@/components/magicui/warp-background";
import router from "next/router";
import Head from "next/head";
import NatAndJosh from "@/components/question-form/NatAndJosh";

export default function Home() {
    const { person } = router.query;

    const selectedPeople = Array.isArray(person) ? person : person ? [person] : [];
  
    const isNat = selectedPeople.includes('nat');
    const isJosh = selectedPeople.includes('josh');
    const N_UUID="05cabf3b-50ab-43e1-b3a7-c31d114db6be"
    const J_UUID="f84a4697-5e37-4bb8-8c24-6ae0e40ecbde"

  return (
    <>
      <Head>
        <title>Make a Wish</title>
      </Head>
      <div className="text-black flex flex-col items-center justify-center w-full min-h-screen bg-white p-4">
        <WarpBackground className="w-full max-w-2xl">
            {isNat && !isJosh && (
                <NatAndJosh cardUUID={N_UUID} birthdayPerson="Nat" />
            )}
            {isJosh && !isNat && (
                <NatAndJosh cardUUID={J_UUID} birthdayPerson="Josh" />
            )}
            {isNat && isJosh && (
                <NatAndJosh cardUUID={N_UUID} birthdayPerson="Nat" cardUUID2={J_UUID} birthdayPerson2="Josh" />
            )}
        </WarpBackground>
      </div>
    </>
  );
}

