import { utils } from "@neptunemutual/sdk";
import { getStoredData } from "@/src/helpers/store";
import { convertToUnits } from "@/utils/bn";

export const getMinStakeToAddLiquidity = async (networkId, provider) => {
  const candidates = [
    {
      key: [utils.keyUtil.PROTOCOL.NS.COVER_LIQUIDITY_MIN_STAKE],
      returns: "uint256",
      property: "minStakeToAddLiquidity",
    },
  ];

  const result = await getStoredData(candidates, networkId, provider);
  let minStakeToAddLiquidity = convertToUnits(250).toString();

  if (result.minStakeToAddLiquidity.toString() !== "0") {
    minStakeToAddLiquidity = result.minStakeToAddLiquidity.toString();
  }

  return minStakeToAddLiquidity;
};
