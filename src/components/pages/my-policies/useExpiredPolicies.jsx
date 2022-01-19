import { useState, useEffect } from "react";
import { getExpiredPolicies } from "@/src/_mocks/policy/policies";

export const useExpiredPolicies = () => {
  const [expiredPolicies, setExpiredPolicies] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchExpiredPolicies() {
      const response = await getExpiredPolicies();

      if (ignore) return;
      setExpiredPolicies(response);
    }

    fetchExpiredPolicies();
    return () => (ignore = true);
  }, []);

  return {
    expiredPolicies,
  };
};
