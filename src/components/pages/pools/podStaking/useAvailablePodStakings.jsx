import { getAvailablePodStakings } from "./podstaking.service.mock";
import { useState, useEffect } from "react";

export const useAvailablePodStakings = () => {
  const [availablePodStakings, setAvailablePodStakings] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchAvailablePodStakings() {
      const response = await getAvailablePodStakings();

      if (!ignore) setAvailablePodStakings(response);
    }

    fetchAvailablePodStakings();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    availablePodStakings,
  };
};
