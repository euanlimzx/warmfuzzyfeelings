import React from "react";

// returns a constantly incrementing number, used to create animating button
function useIncrementingNumber(delay: number = 1000) {
  const [count, setCount] = React.useState(0);

  const savedCallback = React.useRef(() => setCount((c) => c + 1));

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);

  return count;
}

export default useIncrementingNumber;
