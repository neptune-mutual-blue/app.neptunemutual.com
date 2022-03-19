import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { getClaimAmount } from "@/src/helpers/store/getClaimAmount";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { registry } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";

import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useERC20Allowance } from "@/src/hooks/useERC20Allowance";
import { useClaimsProcessorAddress } from "@/src/hooks/contracts/useClaimsProcessorAddress";
import { useERC20Balance } from "@/src/hooks/useERC20Balance";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";

export const useClaimPolicyInfo = ({
  value,
  cxTokenAddress,
  coverKey,
  incidentDate,
}) => {
  const [approving, setApproving] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState("0");

  const { account, library } = useWeb3React();
  const { networkId } = useNetwork();
  const claimsProcessorAddress = useClaimsProcessorAddress();
  const {
    allowance,
    refetch: updateAllowance,
    approve,
  } = useERC20Allowance(cxTokenAddress);
  const { balance, refetch: updateBalance } = useERC20Balance(cxTokenAddress);

  const txToast = useTxToast();
  const { invoke } = useInvokeMethod();
  const { requiresAuth } = useAuthValidation();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    updateAllowance(claimsProcessorAddress);
  }, [claimsProcessorAddress, updateAllowance]);

  useEffect(() => {
    if (!networkId || !value) return;

    const signerOrProvider = getProviderOrSigner(
      library,
      AddressZero,
      networkId
    );

    getClaimAmount(
      networkId,
      convertToUnits(value).toString(),
      signerOrProvider.provider
    ).then((res) => {
      setReceiveAmount(res);
    });
  }, [library, networkId, value]);

  const handleApprove = async () => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth();
      return;
    }

    setApproving(true);
    const onTransactionResult = async (tx) => {
      try {
        await txToast.push(tx, {
          pending: `Approving cxDAI tokens`,
          success: `Approved cxDAI tokens Successfully`,
          failure: `Could not approve cxDAI tokens`,
        });
      } catch (err) {
        notifyError(err, `approve cxDAI tokens`);
      } finally {
        setApproving(false);
      }
    };

    approve(
      claimsProcessorAddress,
      convertToUnits(value).toString(),
      onTransactionResult
    );
  };

  const handleClaim = async () => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth();
      return;
    }

    try {
      setClaiming(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const instance = await registry.ClaimsProcessor.getInstance(
        networkId,
        signerOrProvider
      );

      const onTransactionResult = async (tx) => {
        await txToast.push(tx, {
          pending: `Claiming policy`,
          success: `Claimed policy Successfully`,
          failure: `Could not Claim policy`,
        });

        updateBalance();
        updateAllowance(claimsProcessorAddress);
        setClaiming(false);
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
        catcher: notifyError,
        args,
        onTransactionResult,
      });
    } catch (err) {
      notifyError(err, "claim policy");
      setClaiming(false);
    }
  };

  const canClaim =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));

  const isError =
    value &&
    (!isValidNumber(value) || isGreater(convertToUnits(value || "0"), balance));

  return {
    balance,
    claiming,
    handleClaim,
    canClaim,
    approving,
    handleApprove,
    isError,
    receiveAmount,
  };
};
