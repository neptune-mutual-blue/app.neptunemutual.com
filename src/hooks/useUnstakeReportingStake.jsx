import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

const defaultInfo = {
  totalStakeInWinningCamp: "0",
  totalStakeInLosingCamp: "0",
  myStakeInWinningCamp: "0",
  toBurn: "0",
  toReporter: "0",
  myReward: "0",
};

export const useUnstakeReportingStake = ({ coverKey, incidentDate }) => {
  const [info, setInfo] = useState(defaultInfo);
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const txToast = useTxToast();

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account) {
      return;
    }

    async function fetchInfo() {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContract = await registry.Resolution.getInstance(
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
      ] = await resolutionContract.getUnstakeInfoFor(
        account,
        coverKey,
        incidentDate
      );

      if (ignore) {
        return;
      }

      setInfo({
        totalStakeInWinningCamp: totalStakeInWinningCamp.toString(),
        totalStakeInLosingCamp: totalStakeInLosingCamp.toString(),
        myStakeInWinningCamp: myStakeInWinningCamp.toString(),
        toBurn: toBurn.toString(),
        toReporter: toReporter.toString(),
        myReward: myReward.toString(),
      });
    }

    fetchInfo().catch(console.error);

    return () => {
      ignore = true;
    };
  }, [account, coverKey, incidentDate, library, networkId]);

  const unstake = async () => {
    if (!networkId || !account) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);
    const resolutionContract = await registry.Resolution.getInstance(
      networkId,
      signerOrProvider
    );
    const tx = await resolutionContract.unstake(coverKey, incidentDate);

    await txToast.push(tx, {
      pending: "Unstaking NPM",
      success: "Unstaked NPM Successfully",
      failure: "Could not unstake NPM",
    });
  };

  return {
    info,
    unstake,
  };
};
