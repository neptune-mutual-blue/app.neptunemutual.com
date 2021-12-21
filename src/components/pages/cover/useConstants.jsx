import { useState, useEffect } from "react";

import { getFees, getMaxValueToPurchase } from "./cover.service.mock";

export const useConstants = () => {
  const [fees, setFees] = useState(null);
  const [maxValue, setMaxValue] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchConstants() {
      const getFeesValue = await getFees();
      const getMaxValue = await getMaxValueToPurchase();
      if (!ignore) {
        setFees(getFeesValue);
        setMaxValue(getMaxValue);
      }
    }

    fetchConstants();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    fees,
    maxValue,
  };
};
