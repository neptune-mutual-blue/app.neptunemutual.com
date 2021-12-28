import { useState, useEffect } from "react";

import { earnPercentage } from "./staking.service.mock";

export const useEarningPercentage = () => {
  const [earningPercent, setEarningPercent] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchEarningPercentage() {
      const response = await earnPercentage();

      if (!ignore) setEarningPercent(response);
    }

    fetchEarningPercentage();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    earningPercent,
  };
};
