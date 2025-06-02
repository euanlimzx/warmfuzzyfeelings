import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "@/components/memories/memories";
import { CharacterCard } from "@/components/character-card/character-card";
import SwipeablePages from "@/components/swipeable-pages/SwipeablePages";

export default function Card() {
  return (
    <SwipeablePages>
      <Countdown />
      <CharacterCard />
      <Memories />
    </SwipeablePages>
  );
}
