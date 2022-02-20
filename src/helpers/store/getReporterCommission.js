import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";

export const getReporterCommission = async (networkId, provider) => {
  const candidates = [
    {
      key: [utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTER_COMMISSION],
      returns: "uint256",
      property: "reporterCommission",
      compute: async ({ value }) => {
        return value.toString();
      },
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);

  return result.reporterCommission;
};
