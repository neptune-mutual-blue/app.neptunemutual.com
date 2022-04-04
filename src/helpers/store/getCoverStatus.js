import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";
import { CoverStatus } from "@/src/config/constants";

export const getCoverStatus = async (networkId, coverKey, provider) => {
  const candidates = [
    {
      key: [utils.keyUtil.PROTOCOL.NS.COVER_STATUS, coverKey],
      returns: "uint256",
      property: "status",
      compute: async ({ value }) => {
        return value.toString();
      },
    },
    {
      key: [utils.keyUtil.PROTOCOL.NS.COVER_USER_WHITELIST, coverKey],
      returns: "bool",
      property: "whitelisted",
    },
    {
      key: [utils.keyUtil.PROTOCOL.NS.COVER_REQUIRES_WHITELIST, coverKey],
      returns: "bool",
      property: "requiresWhitelist",
    },

    {
      key: [
        utils.keyUtil.PROTOCOL.NS.GOVERNANCE_REPORTING_INCIDENT_DATE,
        coverKey,
      ],
      returns: "uint256",
      property: "activeIncidentDate",
      compute: async ({ value }) => {
        return value.toString();
      },
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);

  return {
    activeIncidentDate: result.activeIncidentDate,
    status: CoverStatus[result.status],
    whitelisted: result.whitelisted,
    requiresWhitelist: result.requiresWhitelist,
  };
};
