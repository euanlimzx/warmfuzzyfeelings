import { ConfettiFireworks } from "@/components/countdown/confetti";
import { Countdown } from "@/components/countdown/countdown";
import { Memories } from "@/components/memories/memories";

export default function Card() {
  return (
    <div className="h-full">
      <ConfettiFireworks />
      {/* <Memories /> */}
      <Countdown />
    </div>
  );
}
