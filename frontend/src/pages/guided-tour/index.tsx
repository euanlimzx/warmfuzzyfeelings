"use client";

import DemoCard from "./DemoCard";

const GuidedTour = () => {
  return (
    <DemoCard birthdayCardUUID={process.env.NEXT_PUBLIC_DEMO_CARD_UUID!} />
  );
};

export default GuidedTour;
