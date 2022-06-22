import React from "react";

import { useFetchCovers } from "@/src/hooks/useFetchCovers";

const initValue = {
  loading: false,
  covers: [],
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

  return (
    <CoversContext.Provider value={{ covers: data, loading }}>
      {children}
    </CoversContext.Provider>
  );
};
