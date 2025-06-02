import BouncingBubbles from "./bouncing-bubbles";

export function FinalMessages() {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-blue-300">
      <div className="z-10 whitespace-pre-wrap text-center text-5xl font-medium tracking-tighter text-white">
        <BouncingBubbles />
      </div>
    </div>
  );
}
