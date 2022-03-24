import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";
import { convertToUnits } from "@/utils/bn";

export const getLiquidityInfoFromStore = async (
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
      key: [utils.keyUtil.PROTOCOL.NS.ACCRUAL_INVOCATION, coverKey],
      returns: "bool",
      property: "isAccrualComplete",
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);
  return {
    minStakeToAddLiquidity: result.minStakeToAddLiquidity,
    myStake: result.myStake,
    isAccrualComplete: result.isAccrualComplete,
  };
};
