import { useState, useEffect } from "react";

import { getUnlockDate } from "./bond.service.mock";

export const useUnlockDate = () => {
  const [unlockDate, setUnlockDate] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchUnlockDate() {
      const response = await getUnlockDate();

      if (!ignore) setUnlockDate(response);
    }

    fetchUnlockDate();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    unlockDate,
  };
};
