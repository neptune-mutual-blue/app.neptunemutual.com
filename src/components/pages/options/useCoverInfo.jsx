import { useState, useEffect } from "react";

import { getCoverInfo } from "./options.service.mock";

export const useCoverInfo = () => {
  const [coverInfo, setCoverInfo] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchCoverInfo() {
      const response = await getCoverInfo();

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
