import { getActiveReportingList } from "./activereporting.service.mock";
import { useState, useEffect } from "react";

export const useActiveReporting = () => {
  const [activeReportings, setActiveReportings] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchActiveReportings() {
      const response = await getActiveReportingList();

      if (!ignore) setActiveReportings(response);
    }

    fetchActiveReportings();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    activeReportings,
  };
};
