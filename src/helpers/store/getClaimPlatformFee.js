import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";

export const getClaimPlatformFee = async (networkId, provider) => {
  const candidates = [
    {
      key: [utils.keyUtil.PROTOCOL.NS.CLAIM_PLATFORM_FEE],
      returns: "uint256",
      property: "claimPlatformFee",
      compute: async ({ value }) => {
        return value.toString();
      },
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);

  return result.claimPlatformFee;
};
