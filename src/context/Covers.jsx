import React from "react";

import { useFetchCovers } from "@/src/hooks/useFetchCovers";

const initValue = {
  covers: [],
  loading: false,
};

const CoversContext = React.createContext(initValue);

export function useCovers() {
  const context = React.useContext(CoversContext);
  if (context === undefined) {
    throw new Error("useCovers must be used within a CoversProvider");
  }
  return context;
}

export const CoversProvider = ({ children }) => {
  const { data, loading } = useFetchCovers();
  const covers = data.covers;

  return (
    <CoversContext.Provider value={{ covers, loading }}>
      {children}
    </CoversContext.Provider>
  );
};
