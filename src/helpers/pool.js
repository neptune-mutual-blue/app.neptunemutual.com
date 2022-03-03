import { sumOf, toBN } from "@/utils/bn";
import { registry, utils } from "@neptunemutual/sdk";

const getPriceUsingPair = async (chainId, token, amount, signerOrProvider) => {
  const stablecoin = await registry.Stablecoin.getAddress(
    chainId,
    signerOrProvider
  );

  const pair = await utils.uniswapV2.pair.getPairFromFactory(
    chainId,
    token,
    stablecoin,
    signerOrProvider
  );
  console.info("Pair", pair.address);
  const { reserve0, reserve1 } = await pair.getReserves();

  const token1 = await pair.token1();

  const ratio =
    token1 === stablecoin ? reserve1.div(reserve0) : reserve0.div(reserve1);
  return ratio.mul(amount.toLocaleString("fullwide", { useGrouping: false }));
};

export const calcStakingPoolTVL = async (pool, networkId) => {
  try {
    const rewardAmount = toBN(pool.rewardTokenDeposit)
      .minus(pool.totalRewardsWithdrawn)
      .toString();

    const stakingTokenAmount = toBN(pool.totalStakingTokenDeposited)
      .minus(pool.totalStakingTokenWithdrawn)
      .toString();

    const stakingPriceGetter =
      pool.poolType == "PODStaking"
        ? utils.pricing.pod.getPrice
        : getPriceUsingPair;
    const stakingTokenValue = await stakingPriceGetter(
      networkId,
      pool.stakingToken,
      stakingTokenAmount
    );

    const rewardValue = await getPriceUsingPair(
      networkId,
      pool.rewardToken,
      rewardAmount
    );

    return sumOf(
      rewardValue.toString(),
      stakingTokenValue.toString()
    ).toString();
  } catch (e) {
    console.log("Error while calculating pool TVL: ", pool);
    console.error(e);
    return "0";
  }
};
