import BouncingBubbles from "./bouncing-bubbles";
import { Wishes } from "@/types/birthday-card";

export function FinalMessages({ wishes }: { wishes: Wishes[] }) {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-blue-300">
      <div className="flex flex-col items-center justify-center text-center text-white text-2xl font-bold p-10">
        Your wishes are running around! Tap to catch them and read what your
        loved ones have said
      </div>
      <div className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
        <BouncingBubbles wishes={wishes} />
      </div>
    </div>
  );
}
