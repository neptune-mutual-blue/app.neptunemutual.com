import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";
import { convertToUnits } from "@/utils/bn";
import BigNumber from "bignumber.js";

export const getRemainingMinStakeToAddLiquidity = async (
  networkId,
  coverKey,
  account,
  provider
) => {
  const candidates = [
    {
      key: [utils.keyUtil.PROTOCOL.NS.COVER_LIQUIDITY_MIN_STAKE],
      returns: "uint256",
      property: "minStakeToAddLiquidity",
      compute: async ({ value }) => {
        if (value.toString() === "0") {
          return convertToUnits(250).toString();
        }

        return value.toString();
      },
    },
    {
      key: [utils.keyUtil.PROTOCOL.NS.COVER_LIQUIDITY_STAKE, coverKey, account],
      signature: ["bytes32", "bytes32", "address"],
      returns: "uint256",
      property: "myStake",
      compute: async ({ value }) => {
        return value.toString();
      },
    },
    {
      returns: "uint256",
      property: "remaining",
      compute: async ({ result }) => {
        const { minStakeToAddLiquidity, myStake } = result;
        return BigNumber(minStakeToAddLiquidity).minus(myStake).toString();
      },
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);
  return {
    remaining: result.remaining,
    myStake: result.myStake,
  };
};
