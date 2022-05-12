import React, { useCallback, useState } from "react";

const defaultValue = {
  setStatsByKey: (_key, _obj) => {},
  getStatsByKey: (_key) => ({}),
};

const StakingPoolsStatsContext = React.createContext(defaultValue);

/**
 * Used for storing and sorting the data fetched when each card is loaded (like APR)
 * @description DO NOT use `setStatsByKey` and `getStatsByKey` in the same effect (`useEffect`, `useCallback` or `useMemo`)
 */
export function useStakingPoolsStats() {
  const context = React.useContext(StakingPoolsStatsContext);
  if (context === undefined) {
    throw new Error(
      "useStakingPoolsStats must be used within a StakingPoolsStatsProvider"
    );
  }
  return context;
}

export const StakingStatsProvider = ({ children }) => {
  const [state, setState] = useState(defaultValue);

  const setStatsByKey = useCallback((key, obj) => {
    setState((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...obj,
      },
    }));
  }, []);

  const getStatsByKey = useCallback((key) => state[key] || {}, [state]);

  return (
    <StakingPoolsStatsContext.Provider value={{ getStatsByKey, setStatsByKey }}>
      {children}
    </StakingPoolsStatsContext.Provider>
  );
};
