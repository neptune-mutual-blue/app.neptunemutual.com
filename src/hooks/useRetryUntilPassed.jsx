import { useEffect, useState } from "react";

export const useRetryUntilPassed = (callback, interval = 1000) => {
  // Reduce unnecessary re-renders by setting the initial state correctly
  const [passed, setPassed] = useState(() => callback());

  useEffect(() => {
    let ignore = false;

    const intervalId = setInterval(() => {
      if (ignore) return;

      if (callback() === true) {
        setPassed(true);
        clearInterval(intervalId);
      }
    }, interval);

    return () => {
      ignore = true;
      clearInterval(intervalId);
    };
  }, [callback, interval]);

  return passed;
};
