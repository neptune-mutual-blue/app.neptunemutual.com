import { useCallback, useEffect } from "react";

export const useDebouncedEffect = (effect, deps, delay = 500) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = useCallback(effect, deps);

  useEffect(() => {
    let ignore = false;
    const handler = setTimeout(() => {
      callback(ignore);
    }, delay);

    return () => {
      ignore = true;
      clearTimeout(handler);
    };
  }, [callback, delay]);
};
