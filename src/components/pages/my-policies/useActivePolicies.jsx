import { useState, useEffect } from "react";
import { getActivePolicies } from "@/src/_mocks/policy/policies";

export const useActivePolicies = () => {
  const [activePolicies, setActivePolicies] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchActivePolicies() {
      const response = await getActivePolicies();

      if (ignore) return;
      setActivePolicies(response);
    }

    fetchActivePolicies();
    return () => (ignore = true);
  }, []);

  return {
    activePolicies,
  };
};
