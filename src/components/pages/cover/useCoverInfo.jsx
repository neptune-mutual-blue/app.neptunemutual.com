import { useState, useEffect } from "react";

import { getCoverByAddress } from "./cover.service.mock";

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
