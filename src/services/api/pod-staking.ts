import { ADDRESS_ONE, PoolTypes, POOL_INFO_URL } from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";

const ERRORS = {
  NO_NETWORK_ID: "NO_NETWORK_ID",
  NO_KEY: "NO_KEY",
};

export async function getPoolInfo({
  networkId,
  key,
  account = ADDRESS_ONE,
  type = PoolTypes.TOKEN,
}) {
  if (!networkId) {
    throw new Error(ERRORS.NO_NETWORK_ID);
  }

  if (!key) {
    throw new Error(ERRORS.NO_KEY);
  }

  return fetch(
    getReplacedString(POOL_INFO_URL, {
      networkId,
      key,
      account,
      type,
    }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  ).then((res) => res.json());
}

export const defaultInfo = {
  // From store
  stakingPoolsContractAddress: "",
  name: "",
  stakingToken: "",
  stakingTokenStablecoinPair: "",
  rewardToken: "",
  rewardTokenStablecoinPair: "",
  totalStaked: "0",
  target: "0",
  maximumStake: "0",
  stakeBalance: "0",
  cumulativeDeposits: "0",
  rewardPerBlock: "0",
  platformFee: "0",
  lockupPeriodInBlocks: "0",
  rewardTokenBalance: "0",
  myStake: "0",
  totalBlockSinceLastReward: "0",
  rewards: "0",
  canWithdrawFromBlockHeight: "0",
  lastDepositHeight: "0",
  lastRewardHeight: "0",
};
