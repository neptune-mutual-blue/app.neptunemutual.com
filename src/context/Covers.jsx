import React from "react";

import { useFetchCovers } from "@/src/hooks/useFetchCovers";

const initValue = {
  loading: false,
  getInfoByKey: (_key) => ({}),
  getBasketInfoByKey: (_coverKey, _productKey) => ({}),
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
  const { data, loading, getInfoByKey, getBasketInfoByKey } = useFetchCovers();

  return (
    <CoversContext.Provider
      value={{ covers: data, getInfoByKey, getBasketInfoByKey, loading }}
    >
      {children}
    </CoversContext.Provider>
  );
};
