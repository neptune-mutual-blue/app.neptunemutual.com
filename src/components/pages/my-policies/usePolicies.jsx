import { useState, useEffect } from "react";

import { getActivePolicy } from "./policy.service.mock";

export const usePolicies = () => {
  const [activePolicy, setActivePolicy] = useState(null);
  const [expiredPolicy, setExpiredPolicy] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchActivePolicy() {
      const response = await getActivePolicy();

      if (!ignore) {
        setActivePolicy(response);
        setExpiredPolicy(response);
      }
    }

    fetchActivePolicy();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    activePolicy,
    expiredPolicy,
  };
};
