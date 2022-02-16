import { useState, useEffect } from "react";
import { liquidity, registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useLiquidityBalance } from "@/src/hooks/useLiquidityBalance";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useNPMBalance } from "@/src/hooks/useNPMBalance";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useAppContext } from "@/src/context/AppWrapper";
import { getMinStakeToAddLiquidity } from "@/src/helpers/store/getMinStakeToAddLiquidity";

export const useProvideLiquidity = ({ coverKey, lqValue, npmValue }) => {
  const [lqTokenAllowance, setLqTokenAllowance] = useState();
  const [npmTokenAllowance, setNPMTokenAllowance] = useState();
  const [lqApproving, setLqApproving] = useState();
  const [npmApproving, setNPMApproving] = useState();
  const [providing, setProviding] = useState();
  const [vaultAddress, setVaultAddress] = useState("");
  const [minNpmStake, setMinNpmStake] = useState("0");
  const podSymbol = useTokenSymbol(vaultAddress);

  const txToast = useTxToast();

  const { networkId } = useAppContext();
  const { library, account } = useWeb3React();
  const { balance: lqTokenBalance } = useLiquidityBalance();
  const { balance: npmBalance } = useNPMBalance();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;
    if (!networkId) return;

    async function fetchMinStake() {
      const signerOrProvider = getProviderOrSigner(
        library,
        AddressZero,
        networkId
      );

      const _minNpmStake = await getMinStakeToAddLiquidity(
        networkId,
        signerOrProvider.provider
      );

      if (ignore) return;
      console.log(_minNpmStake);
      setMinNpmStake(_minNpmStake);
    }

    fetchMinStake();

    return () => {
      ignore = true;
    };
  }, [library, networkId]);

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    registry.Vault.getAddress(networkId, coverKey, signerOrProvider)
      .then((addr) => {
        if (ignore) return;
        return setVaultAddress(addr);
      })
      .catch(console.error);

    return () => (ignore = true);
  }, [networkId, account, library, coverKey]);

  useEffect(() => {
    if (!networkId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    liquidity
      .getAllowance(networkId, coverKey, account, signerOrProvider)
      .then(({ result }) => {
        if (ignore) return;
        setLqTokenAllowance(result);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    checkNPMTokenAllowance();

    return () => (ignore = true);
  }, [account, networkId, library, coverKey]);

  const checkLqTokenAllowance = async () => {
    if (!networkId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      const { result: _allowance } = await liquidity.getAllowance(
        networkId,
        coverKey,
        account,
        signerOrProvider
      );

      setLqTokenAllowance(_allowance);
    } catch (e) {
      console.error(e);
    }
  };

  const checkNPMTokenAllowance = async () => {
    if (!networkId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    try {
      const vault = await registry.Vault.getAddress(
        networkId,
        coverKey,
        signerOrProvider
      );

      const npmInstance = await registry.NPMToken.getInstance(
        networkId,
        signerOrProvider
      );
      const _allowance = await npmInstance.allowance(account, vault);

      setNPMTokenAllowance(_allowance);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLqTokenApprove = async () => {
    try {
      setLqApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { result: tx } = await liquidity.approve(
        networkId,
        coverKey,
        {},
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Approving DAI",
        success: "Approved DAI Successfully",
        failure: "Could not approve DAI",
      });

      setLqApproving(false);
      checkLqTokenAllowance();
    } catch (error) {
      notifyError(error, "approve DAI");
      setLqApproving(false);
    }
  };

  const handleNPMTokenApprove = async () => {
    try {
      setNPMApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, networkId);

      const { result: tx } = await liquidity.approveStake(
        networkId,
        coverKey,
        {},
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Approving NPM",
        success: "Approved NPM Successfully",
        failure: "Could not approve NPM",
      });

      setNPMApproving(false);
      checkNPMTokenAllowance();
    } catch (error) {
      notifyError(error, "approve NPM");
      setNPMApproving(false);
    }
  };

  const handleProvide = async () => {
    try {
      setProviding(true);

      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const lqAmount = convertToUnits(lqValue).toString();
      const npmAmount = convertToUnits(npmValue).toString();

      const { result: tx } = await liquidity.add(
        networkId,
        coverKey,
        lqAmount,
        npmAmount,
        signerOrProvider
      );

      await txToast.push(tx, {
        pending: "Adding Liquidity",
        success: "Added Liquidity Successfully",
        failure: "Could not add liquidity",
      });
    } catch (err) {
      // console.error(err);
      notifyError(err, "add liquidity");
    } finally {
      setProviding(false);
    }
  };

  const hasLqTokenAllowance = isGreaterOrEqual(
    lqTokenAllowance || "0",
    convertToUnits(lqValue || "0")
  );
  const hasNPMTokenAllowance = isGreaterOrEqual(
    npmTokenAllowance || "0",
    convertToUnits(npmValue || "0")
  );

  const canProvideLiquidity =
    lqValue &&
    isValidNumber(lqValue) &&
    hasLqTokenAllowance &&
    hasNPMTokenAllowance;
  const isError =
    lqValue &&
    (!isValidNumber(lqValue) ||
      isGreater(convertToUnits(lqValue || "0"), lqTokenBalance || "0"));

  return {
    lqTokenBalance,
    npmBalance,
    hasLqTokenAllowance,
    hasNPMTokenAllowance,
    canProvideLiquidity,
    isError,
    lqApproving,
    npmApproving,
    providing,
    handleLqTokenApprove,
    handleNPMTokenApprove,
    handleProvide,
    podSymbol,
    minNpmStake,
  };
};
