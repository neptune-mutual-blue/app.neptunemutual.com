import { useState, useEffect } from "react";

import { getCoverByKey } from "./cover.service.mock";

export const useCoverInfo = (key) => {
  const [coverInfo, setCoverInfo] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchCoverInfo() {
      const response = await getCoverByKey(key);

      if (!ignore) setCoverInfo(response);
    }

    fetchCoverInfo();
    return () => {
      ignore = true;
    };
  }, [key]);

  return {
    coverInfo,
  };
};
