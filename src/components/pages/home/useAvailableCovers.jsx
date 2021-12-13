import { useState, useEffect } from "react";

import { getAvailableCovers } from "./home.service.mock";

export const useAvailableCovers = () => {
  const [availableCovers, setAvailableCovers] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchAvailableCovers() {
      const response = await getAvailableCovers();

      if (!ignore) setAvailableCovers(response);
    }

    fetchAvailableCovers();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    availableCovers,
  };
};
