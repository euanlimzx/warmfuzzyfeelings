import useIncrementingNumber from "../../hooks/question-form/useIncrementingNumber";
import { useEffect } from "react";

interface cssColorProperties {
  "--sky-color-0": string;
  "--sky-color-1": string;
}

const paletteColors = [
  "#6dd3ff",
  "#50a2ff",
  "#bcb4ff",
  "#ffd2fb",
  "#d494ee",
  "#7664ca",
  "#2e187e",
];

const useColors = (height: number): cssColorProperties => {
  useEffect(() => {
    for (let i = 0; i < paletteColors.length; ++i) {
      try {
        // setting the colors as a CSS property allows transitions to occur on the colors themselves
        // not putting these would cause the transitions to be jumpy
        CSS.registerProperty({
          name: `--sky-color-${i}`,
          initialValue: paletteColors[i],
          syntax: "<color>",
          inherits: false,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }, []);

  return {
    "--sky-color-0": paletteColors[height % paletteColors.length],
    "--sky-color-1": paletteColors[(height + 1) % paletteColors.length],
  };
};

const RainbowButton: React.FC = () => {
  const delay = 3000;
  const counter = useIncrementingNumber(delay);
  const colors = useColors(counter);

  const colorKeys = Object.keys(colors);

  return (
    <button
      className="h-full w-full cursor-pointer rounded-md p-4"
      style={{
        ...colors,
        transition: `
                ${colorKeys[0]} ${delay}ms linear,
                ${colorKeys[1]} ${delay}ms linear
            `,

        background: `
                radial-gradient(
                    circle at 50% 100%,
                    var(${colorKeys[0]}) 0%,
                    var(${colorKeys[1]}) 100%
            `,
      }}
    >
      Submit this bad boy
    </button>
  );
};

export default RainbowButton;
