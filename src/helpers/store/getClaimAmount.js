import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";
import BigNumber from "bignumber.js";
import { MULTIPLIER } from "@/src/config/constants";

export const getClaimAmount = async (networkId, cxTokenAmount, provider) => {
  const candidates = [
    {
      key: [utils.keyUtil.PROTOCOL.NS.CLAIM_PLATFORM_FEE],
      returns: "uint256",
      property: "claimPlatformFee",
    },
    {
      returns: "uint256",
      property: "claimAmount",
      compute: async ({ result }) => {
        const { claimPlatformFee } = result;

        const platformFeeAmount = BigNumber(cxTokenAmount.toString())
          .multipliedBy(claimPlatformFee.toString())
          .dividedBy(MULTIPLIER);
        const claimAmount = BigNumber(cxTokenAmount.toString()).minus(
          platformFeeAmount
        );
        return claimAmount.toString();
      },
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);

  return result.claimAmount;
};
