import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";

export const getReportingPeriod = async (networkId, coverKey, provider) => {
  const candidates = [
    {
      key: [utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_PERIOD, coverKey],
      returns: "uint256",
      property: "reportingPeriod",
      compute: async ({ value }) => {
        return value.toString();
      },
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);

  return result.reportingPeriod;
};
