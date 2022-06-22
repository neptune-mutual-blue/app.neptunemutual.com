import { isValidProduct } from "@/src/helpers/cover";
import {
  getCoverData,
  getCoverProductData,
} from "@/src/services/covers-products";
import { createContext, useCallback, useContext, useRef } from "react";

const CoversAndProductsDataContext = createContext({
  // eslint-disable-next-line unused-imports/no-unused-vars
  getCoverOrProductData: async ({ coverKey, productKey, networkId }) => null,
});

export function useCoversAndProducts() {
  const context = useContext(CoversAndProductsDataContext);
  if (context === undefined) {
    throw new Error(
      "useCoversAndProducts must be used within a CoversAndProductsProvider"
    );
  }
  return context;
}

export const CoversAndProductsProvider = ({ children }) => {
  const store = useRef({});

  const addToStore = useCallback((key, val) => {
    store.current[key] = val;
  }, []);

  const getFromStore = useCallback((key) => {
    return store.current[key];
  }, []);

  const getOrFetch = useCallback(
    async (key, fetcher) => {
      const stored = getFromStore(key);
      if (stored) {
        return stored;
      }

      const fetched = await fetcher();
      addToStore(key, fetched);
      return fetched;
    },
    [addToStore, getFromStore]
  );

  const getCoverOrProductData = useCallback(
    async ({ coverKey, productKey, networkId }) => {
      if (isValidProduct(productKey)) {
        const storeKey = `${coverKey}-${productKey}`;

        return getOrFetch(storeKey, () =>
          getCoverProductData(networkId, coverKey, productKey)
        );
      }

      return getOrFetch(coverKey, () => getCoverData(networkId, coverKey));
    },
    [getOrFetch]
  );

  return (
    <CoversAndProductsDataContext.Provider value={{ getCoverOrProductData }}>
      {children}
    </CoversAndProductsDataContext.Provider>
  );
};
