import { useCallback, useEffect, useRef, useState } from "react";
import { useWeb3React } from "@web3-react/core";

import { useNetwork } from "@/src/context/Network";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { PoolTypes } from "@/src/config/constants";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { getInfo as getStakingPoolInfo } from "@/src/services/protocol/staking-pool/info";
import { t } from "@lingui/macro";

const defaultInfo = {
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

export const usePoolInfo = ({ key, type = PoolTypes.TOKEN }) => {
  const [info, setInfo] = useState(defaultInfo);
  const mountedRef = useRef(false);

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const { notifyError } = useErrorNotifier();

  const fetchPoolInfo = useCallback(async () => {
    if (!networkId || !account || !key) {
      return;
    }

    const handleError = (err) => {
      notifyError(err, t`get pool info`);
    };

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    getStakingPoolInfo(networkId, type, key, account, signerOrProvider.provider)
      .then((_info) => {
        if (!_info) return;

        setInfo((prevData) => ({ ...prevData, ..._info }));
      })
      .catch((err) => handleError(err));
  }, [account, key, library, networkId, notifyError, type]);

  useEffect(() => {
    mountedRef.current = true;
    fetchPoolInfo();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchPoolInfo]);

  return { info, refetch: fetchPoolInfo };
};
