import { useState, useEffect } from "react";
import { useNetwork } from "@/src/context/Network";

const isValidTimestamp = (_unix) => !!_unix && _unix != "0";

const getQuery = (start, end, coverKey, productKey) => {
  return `
  {
    incidentReports(
      where: {
        incidentDate_gt: "${start}",
        incidentDate_lt: "${end}",
        coverKey: "${coverKey}"
        productKey: "${productKey}"
      },
      orderBy: incidentDate,
      orderDirection: desc
    ) {
      incidentDate
      resolutionDeadline
      status
      claimBeginsFrom
      claimExpiresAt
    }
  }
  `;
};

/**
 * @typedef {import('@/src/services/fetchSubgraph').FetchSubgraph} FetchSubgraph
 *
 * @param {FetchSubgraph} fetchValidReport
 * @param {*} param1
 * @returns
 */
export const useValidReport = (
  fetchValidReport,
  { start, end, coverKey, productKey }
) => {
  const [data, setData] = useState({
    claimBeginsFrom: "0",
    claimExpiresAt: "0",
    incidentDate: "",
    resolutionDeadline: "0",
    status: "",
  });
  const { networkId } = useNetwork();

  useEffect(() => {
    (async () => {
      if (!isValidTimestamp(start) || !isValidTimestamp(end)) {
        return;
      }

      const data = await fetchValidReport(
        networkId,
        getQuery(start, end, coverKey, productKey)
      ).catch(console.error);

      if (!data && !data.incidentReports.length) return;

      setData(data.incidentReports[0]);
    })();
  }, [coverKey, end, fetchValidReport, networkId, productKey, start]);

  return data;
};
