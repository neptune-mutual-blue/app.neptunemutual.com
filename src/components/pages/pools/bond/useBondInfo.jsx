import { useState, useEffect } from "react";

import { getBondData } from "./bond.service.mock";

export const useBondInfo = () => {
  const [bondInfo, setBondInfo] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchBondInfo() {
      const response = await getBondData();

      if (!ignore) setBondInfo(response);
    }

    fetchBondInfo();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    bondInfo,
  };
};
