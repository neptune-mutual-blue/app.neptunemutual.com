import { useState, useEffect } from "react";

import {
  getCoverByAddress,
  getFees,
  getMaxValueToPurchase,
} from "./cover.service.mock";

export const useCoverInfo = () => {
  const [coverInfo, setCoverInfo] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchCoverInfo() {
      const response = await getCoverByAddress();

      if (!ignore) setCoverInfo(response);
    }

    fetchCoverInfo();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    coverInfo,
  };
};

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
