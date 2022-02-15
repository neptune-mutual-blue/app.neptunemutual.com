import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { config, registry } from "@neptunemutual/sdk";
import { convertToUnits, isGreaterOrEqual, isValidNumber } from "@/utils/bn";
import { useAppContext } from "@/src/context/AppWrapper";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

const defaultInfo = {
  totalStakeInWinningCamp: "0",
  totalStakeInLosingCamp: "0",
  myStakeInWinningCamp: "0",
  toBurn: "0",
  toReporter: "0",
  myReward: "0",
};

export const useReportingUnstake = ({ coverKey, incidentDate, value }) => {
  const [balance, setBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [info, setInfo] = useState(defaultInfo);
  const [approving, setApproving] = useState(false);
  const [voting, setVoting] = useState(false);

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { NPMTokenAddress } = useAppConstants();
  const tokenSymbol = useTokenSymbol(NPMTokenAddress);
  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    if (!networkId || !account) return;

    let ignore = false;
    async function fetchUnstakeInfo() {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const netConfig = await config.networks.getChainConfig(networkId);
      const resolution = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );
      const [
        totalStakeInWinningCamp,
        totalStakeInLosingCamp,
        myStakeInWinningCamp,
        toBurn,
        toReporter,
        myReward,
      ] = await resolution.getUnstakeInfoFor(
        netConfig.store,
        account,
        coverKey,
        incidentDate || "0"
      );

      const info = {
        totalStakeInWinningCamp: totalStakeInWinningCamp.toString(),
        totalStakeInLosingCamp: totalStakeInLosingCamp.toString(),
        myStakeInWinningCamp: myStakeInWinningCamp.toString(),
        toBurn: toBurn.toString(),
        toReporter: toReporter.toString(),
        myReward: myReward.toString(),
      };

      if (ignore) return;
      setInfo(info);
    }

    fetchUnstakeInfo().catch(console.log);

    return () => (ignore = true);
  }, [account, coverKey, library, networkId]);

  const handleUnstake = async () => {
    setVoting(true);

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const resolution = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );

      const tx = await resolution.unstake(coverKey, incidentDate);

      await txToast.push(tx, {
        pending: "Unstaking",
        success: "Unstaked successfully",
        failure: "Could not unstake",
      });
    } catch (err) {
      // console.error(err);
      notifyError(err, "unstake");
    } finally {
      setVoting(false);
    }
  };

  const canUnstake =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(info.myStakeInWinningCamp, convertToUnits(value || "0"));

  return {
    tokenAddress: NPMTokenAddress,
    tokenSymbol,
    myStakeInWinningCamp: info.myStakeInWinningCamp,
    canUnstake,
    handleUnstake,
  };
};
