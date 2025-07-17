import React from "react";
import { Marquee } from "@/components/magicui/marquee";
import { cn } from "@/lib/utils";
import { MarqueeMemory } from "@/types/birthday-card";
 
const ReviewCard = ({
  name,
  memory,
}: {
  name: string;
  memory: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-50 w-fit max-w-70 cursor-pointer overflow-hidden p-4 bg-white text-black border-black border-2"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full border border-black" width="32" height="32" alt="" src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${name}&shapeColor=ffffff&backgroundType=solid`} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-black">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-black/40">@ {name}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-black">{memory}</blockquote>
    </figure>
  );
};

export const MarqueeMemories = ({ memories }: { memories: MarqueeMemory[] }) => {
  return (
    <div className="w-full h-full bg-purple-300 flex flex-col items-center justify-center">
      <text className="max-w-3/4 mb-10 text-white text-center text-2xl md:text-4xl font-semibold">Speaking of memories, here are our favorite ones of you :)</text>
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <Marquee pauseOnHover className="[--duration:60s]">
          {memories.map((memory) => (
            <ReviewCard key={memory.name} {...memory} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:60s]">
          {memories.map((memory) => (
            <ReviewCard key={memory.name} {...memory} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-purple-300"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-purple-300"></div>
      </div>
    </div>
  );
};