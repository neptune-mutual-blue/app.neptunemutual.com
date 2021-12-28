import { getAvailableStakings } from "./staking.service.mock";
import { useState, useEffect } from "react";

export const useAvailableStakings = () => {
  const [availableStakings, setAvailableStakings] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchAvailableStakings() {
      const response = await getAvailableStakings();

      if (!ignore) setAvailableStakings(response);
    }

    fetchAvailableStakings();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    availableStakings,
  };
};
