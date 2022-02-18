import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { getClaimAmount } from "@/src/helpers/store/getClaimAmount";
import { useApprovalAmount } from "@/src/hooks/useApprovalAmount";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { claimsProcessor, registry } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";

import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";

export const useClaimPolicyInfo = ({
  value,
  cxTokenAddress,
  coverKey,
  incidentDate,
}) => {
  const [balance, setBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [approving, setApproving] = useState(false);
  const [receiveAmount, setReceiveAmount] = useState("0");

  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();
  const { getApprovalAmount } = useApprovalAmount();

  const { requiresAuth } = useAuthValidation();
  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

  const checkAllowance = async () => {
    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { result } = await claimsProcessor.getAllowance(
        networkId,
        cxTokenAddress,
        account,
        signerOrProvider
      );

      setAllowance(result.toString());
    } catch (error) {
      console.error(error);
    }
  };

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

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account || !cxTokenAddress) return;

    checkAllowance();

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    const instance = registry.IERC20.getInstance(
      networkId,
      cxTokenAddress,
      signerOrProvider
    );

    instance
      .balanceOf(account)
      .then((bal) => {
        if (ignore) return;
        setBalance(bal.toString());
      })
      .catch((e) => {
        console.error(e);
      });

    return () => {
      ignore = true;
    };
  }, [account, networkId, library, cxTokenAddress]);

  const handleApprove = async () => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth();
      return;
    }

    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { result: tx } = await claimsProcessor.approve(
        networkId,
        cxTokenAddress,
        {
          amount: getApprovalAmount(convertToUnits(value).toString()),
        },
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: `Approving cxDAI tokens`,
        success: `Approved cxDAI tokens Successfully`,
        failure: `Could not approve cxDAI tokens`,
      });

      checkAllowance();
    } catch (error) {
      // console.error(error);
      notifyError(error, `approve cxDAI tokens`);
    } finally {
      setApproving(false);
    }
  };

  const handleClaim = async () => {
    if (!networkId || !account || !cxTokenAddress) {
      requiresAuth();
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { result: tx } = await claimsProcessor.claim(
        networkId,
        cxTokenAddress,
        coverKey,
        incidentDate,
        convertToUnits(value).toString(),
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: `Claiming policy`,
        success: `Claimed policy Successfully`,
        failure: `Could not Claim policy`,
      });
    } catch (err) {
      notifyError(err, "claim policy");
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
    handleClaim,
    canClaim,
    approving,
    handleApprove,
    isError,
    receiveAmount,
  };
};
