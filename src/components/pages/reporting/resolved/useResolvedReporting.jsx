import { getResolvedReportingList } from "./resolved.service.mock";
import { useState, useEffect } from "react";

export const useResolvedReporting = () => {
  const [resolvedReportings, setResolvedReportings] = useState(null);

  useEffect(() => {
    let ignore = false;
    async function fetchResolvedReportings() {
      const response = await getResolvedReportingList();

      if (!ignore) setResolvedReportings(response);
    }

    fetchResolvedReportings();
    return () => {
      ignore = true;
    };
  }, []);

  return {
    resolvedReportings,
  };
};
