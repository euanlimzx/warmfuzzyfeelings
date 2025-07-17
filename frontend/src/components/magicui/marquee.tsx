import { cn } from "@/lib/utils";
import React, { ComponentPropsWithoutRef, useRef, useEffect, useState } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  ...props
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(2);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;
    const containerSize = vertical
      ? containerRef.current.offsetHeight
      : containerRef.current.offsetWidth;
    const contentSize = vertical
      ? contentRef.current.scrollHeight
      : contentRef.current.scrollWidth;
    if (contentSize === 0) return;
    // Ensure at least 2 copies, but enough to fill twice the container
    const minRepeats = Math.ceil((containerSize * 2) / contentSize);
    setRepeatCount(Math.max(2, minRepeats));
  }, [children, vertical]);

  // Prepare repeated children
  const repeatedChildren = Array.from({ length: repeatCount }, (_, i) => (
    <div
      key={i}
      ref={i === 0 ? contentRef : undefined}
      className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
        "animate-marquee flex-row": !vertical,
        "animate-marquee-vertical flex-col": vertical,
        "group-hover:[animation-play-state:paused]": pauseOnHover,
        "animate-marquee-reverse": reverse,
      })}
      style={{
        // Only animate the first copy, others are static
        animationPlayState: pauseOnHover ? undefined : undefined,
      }}
    >
      {children}
    </div>
  ));

  return (
    <div
      {...props}
      ref={containerRef}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className,
      )}
    >
      {repeatedChildren}
    </div>
  );
}
