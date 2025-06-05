"use client";

import { useEffect, useRef, useState } from "react";
import { InteractiveGridPattern } from "../magicui/interactive-grid-pattern";
import { MessageModalWrapper } from "./message-modal";
import { Wishes } from "@/types/wishes";

interface Bubble {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function BouncingBubbles({ wishes }: { wishes: Wishes[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<Bubble[]>([]);
  const animationRef = useRef<number>();
  const [activeBubbles, setActiveBubbles] = useState<number[]>(
    Array.from({ length: wishes.length }, (_, i) => i + 1)
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = 400;
    const containerHeight = 400;
    const bubbleSize = 40;

    // Initialize bubbles with random positions and velocities
    bubblesRef.current = Array.from({ length: wishes.length }, (_, i) => ({
      id: i + 1,
      x: Math.random() * (containerWidth - bubbleSize),
      y: Math.random() * (containerHeight - bubbleSize),
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
    }));

    const animate = () => {
      bubblesRef.current.forEach((bubble) => {
        // Skip animation for removed bubbles
        if (!activeBubbles.includes(bubble.id)) return;

        // Update position
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Bounce off walls
        if (bubble.x <= 0 || bubble.x >= containerWidth - bubbleSize) {
          bubble.vx = -bubble.vx;
          bubble.x = Math.max(
            0,
            Math.min(containerWidth - bubbleSize, bubble.x)
          );
        }
        if (bubble.y <= 0 || bubble.y >= containerHeight - bubbleSize) {
          bubble.vy = -bubble.vy;
          bubble.y = Math.max(
            0,
            Math.min(containerHeight - bubbleSize, bubble.y)
          );
        }

        // Update DOM element
        const element = container.querySelector(
          `[data-id="${bubble.id}"]`
        ) as HTMLElement;
        if (element) {
          element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const handleBubbleClick = (id: number) => {
    setActiveBubbles((prev) => prev.filter((bubbleId) => bubbleId !== id));
  };

  return (
    <div className=" border-2 border-black">
      <div
        ref={containerRef}
        className="relative border border-gray-300 bg-gray-50"
        style={{ width: 400, height: 400 }}
      >
        <InteractiveGridPattern squaresClassName="hover:fill-blue-500" />
        {wishes.map((wish, i) => {
          const id = i + 1;
          return activeBubbles.includes(id) ? (
            <MessageModalWrapper
              key={id}
              wish={wish}
              id={id}
              handleBubbleClick={handleBubbleClick}
            >
              <div
                key={id}
                data-id={id}
                className="absolute flex items-center justify-center rounded-full overflow-hidden bg-white border-2 border-black cursor-pointer"
                style={{ width: 60, height: 60 }}
              >
                <img
                  src={`https://api.dicebear.com/9.x/thumbs/svg?seed=${id}&shapeColor=ffffff&backgroundType=solid`}
                  alt={`Avatar ${id}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </MessageModalWrapper>
          ) : null;
        })}
      </div>
    </div>
  );
}
