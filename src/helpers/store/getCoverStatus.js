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
  ];

  const result = await getStoredData(candidates, networkId, provider);

  return CoverStatus[result.status];
};
