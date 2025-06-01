import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "@/components/memories/memories";
import { CharacterCard } from "@/components/character-card/character-card";

export default function Card() {
  return (
    <div className="h-full">
      <Countdown />
      <CharacterCard />
      <Memories />
    </div>
  );
}
