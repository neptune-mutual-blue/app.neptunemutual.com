import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
  toBN,
} from "@/utils/bn";
import { registry } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useClaimsProcessorAddress } from "@/src/hooks/contracts/useClaimsProcessorAddress";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useCxTokenRowContext } from "@/src/modules/my-policies/CxTokenRowContext";
import { getClaimPlatformFee } from "@/src/helpers/store/getClaimPlatformFee";
import { MULTIPLIER } from "@/src/config/constants";
import { t } from "@lingui/macro";
import { txToast } from "@/src/store/toast";

export const useClaimPolicyInfo = ({
  value,
  cxTokenAddress,
  coverKey,
  incidentDate,
}) => {
  const [approving, setApproving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [loadingFees, setLoadingFees] = useState(false);
  const [claimPlatformFee, setClaimPlatformFee] = useState("0");
  const [error, setError] = useState("");

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const claimsProcessorAddress = useClaimsProcessorAddress();
  const { balance, refetchBalance } = useCxTokenRowContext();
  const {
    allowance,
    loading: loadingAllowance,
    refetch: updateAllowance,
    approve,
  } = useERC20Allowance(cxTokenAddress);

  const { invoke } = useInvokeMethod();
  const { requiresAuth } = useAuthValidation();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(claimsProcessorAddress);
  }, [claimsProcessorAddress, updateAllowance]);

  // Fetching fees
  useEffect(() => {
    if (!networkId) return;

    const signerOrProvider = getProviderOrSigner(
      library,
      AddressZero,
      networkId
    );

    setLoadingFees(true);
    getClaimPlatformFee(networkId, signerOrProvider.provider)
      .then((result) => setClaimPlatformFee(result))
      .finally(() => setLoadingFees(false));
  }, [library, networkId, value]);

  // Update receive amount
  useEffect(() => {
    if (!value) return;

    const cxTokenAmount = convertToUnits(value).toString();

    // cxTokenAmount * claimPlatformFee / MULTIPLIER
    const platformFeeAmount = toBN(cxTokenAmount)
      .multipliedBy(claimPlatformFee)
      .dividedBy(MULTIPLIER);

    // cxTokenAmount - platformFeeAmount
    const claimAmount = toBN(cxTokenAmount).minus(platformFeeAmount).toString();

    setReceiveAmount(claimAmount);
  }, [claimPlatformFee, value]);

  // RESET STATE
  useEffect(() => {
    if (!value && receiveAmount !== "0") {
      setReceiveAmount("0");
    }
  }, [receiveAmount, value]);

  const handleApprove = async () => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth();
      return;
    }

    setApproving(true);
    const cleanup = () => {
      setApproving(false);
    };
    const handleError = (err) => {
      notifyError(err, t`approve cxDAI tokens`);
    };

    const onTransactionResult = async (tx) => {
      try {
        await txToast({
          tx,
          titles: {
            pending: t`Approving cxDAI tokens`,
            success: t`Approved cxDAI tokens Successfully`,
            failure: t`Could not approve cxDAI tokens`,
          },
          networkId,
        });
        cleanup();
      } catch (err) {
        handleError(err);
        cleanup();
      }
    };

    const onRetryCancel = () => {
      cleanup();
    };

    const onError = (err) => {
      handleError(err);
      cleanup();
    };

    approve(claimsProcessorAddress, convertToUnits(value).toString(), {
      onTransactionResult,
      onRetryCancel,
      onError,
    });
  };

  const handleClaim = async (onTxSuccess) => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth();
      return;
    }

    setClaiming(true);

    const cleanup = () => {
      updateAllowance(claimsProcessorAddress);
      setClaiming(false);
    };

    const handleError = (err) => {
      notifyError(err, t`claim policy`);
    };

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.ClaimsProcessor.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast({
          tx,
          titles: {
            pending: t`Claiming policy`,
            success: t`Claimed policy Successfully`,
            failure: t`Could not Claim policy`,
          },
          options: {
            onTxSuccess: () => {
              refetchBalance();
              onTxSuccess();
            },
          },
          networkId,
        });
        cleanup();
      };

      const onRetryCancel = () => {
        cleanup();
      };

      const onError = (err) => {
        handleError(err);
        cleanup();
      };

      const args = [
        cxTokenAddress,
        coverKey,
        incidentDate,
        convertToUnits(value).toString(),
      ];
      invoke({
        instance,
        methodName: "claim",
        args,
        onTransactionResult,
        onRetryCancel,
        onError,
      });
    } catch (err) {
      handleError(err);
      cleanup();
    }
  };

  useEffect(() => {
    if (!value && error) {
      setError("");
      return;
    }

    if (!value) {
      return;
    }

    if (!account) {
      setError(t`Please connect your wallet`);
      return;
    }

    if (!isValidNumber(value)) {
      setError(t`Invalid amount to claim`);
      return;
    }

    if (isGreater(convertToUnits(value), balance || "0")) {
      setError(t`Insufficient Balance`);
      return;
    }

    if (error) {
      setError("");
      return;
    }
  }, [account, balance, error, value]);

  const canClaim =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));

  return {
    claiming,
    handleClaim,
    canClaim,
    loadingAllowance,
    approving,
    handleApprove,
    error,
    receiveAmount,
    loadingFees,
    claimPlatformFee,
  };
};
