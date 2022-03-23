import { useCallback, useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { useNetwork } from "@/src/context/Network";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { POOL_INFO_URL } from "@/src/config/constants";
import { getReplacedString } from "@/utils/string";

const defaultInfo = {
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

  rewardTokenDecimals: "0",
  stakingTokenDecimals: "0",
  stakingTokenPrice: "0",
  rewardTokenPrice: "0",
  apr: "0",
  stakingPoolsContractAddress: "",
};

export const usePoolInfo = ({ key, type = "token" }) => {
  const [info, setInfo] = useState(defaultInfo);
  const mountedRef = useRef(false);

  const { account } = useWeb3React();
  const { networkId } = useNetwork();
  const { notifyError } = useErrorNotifier();

  const fetchPoolInfo = useCallback(async () => {
    if (!networkId || !account || !key) {
      return;
    }

    const handleError = (err) => {
      notifyError(err, "get pool info");
    };

    try {
      const response = await fetch(
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
      );

      const { data } = await response.json();
      setInfo(data);
    } catch (err) {
      handleError(err);
    }
  }, [account, key, networkId, notifyError, type]);

  useEffect(() => {
    mountedRef.current = true;
    fetchPoolInfo();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchPoolInfo]);

  return { info, refetch: fetchPoolInfo };
};
