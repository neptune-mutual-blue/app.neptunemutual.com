import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { liquidity, registry } from "@neptunemutual/sdk";

import { useWeb3React } from "@web3-react/core";
import {
  convertToUnits,
  convertFromUnits,
  isGreater,
  isValidNumber,
} from "@/utils/bn";

import { useConstants } from "@/components/pages/cover/useConstants";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { UnlockDate } from "@/components/UI/organisms/unlock-date";

import { useToast } from "@/lib/toast/context";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";

import OpenInNewIcon from "@/icons/open-in-new";

const ERROR_TIMEOUT = 30000; // 30 seconds

export const CoverFormAddLiquidity = ({
  assuranceTokenAddress,
  assuranceTokenSymbol,
  coverKey,
}) => {
  const router = useRouter();
  const toast = useToast();
  const { fees, maxValue } = useConstants();

  const { library, account, chainId } = useWeb3React();

  const [value, setValue] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [balance, setBalance] = useState();
  const [allowance, setAllowance] = useState();
  const [approving, setApproving] = useState();
  const [providing, setProviding] = useState();

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    const instance = registry.IERC20.getInstance(
      chainId,
      assuranceTokenAddress,
      signerOrProvider
    );

    if (!instance) {
      console.log("No instance found");
    }

    instance
      .balanceOf(account)
      .then((bal) => {
        if (ignore) return;
        setBalance(bal);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, assuranceTokenAddress]);

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    liquidity
      .getAllowance(chainId, coverKey, account, signerOrProvider)
      .then(({ result }) => {
        if (ignore) return;
        setAllowance(result);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, assuranceTokenAddress, coverKey]);

  const handleChooseMax = () => {
    if (!balance) {
      return;
    }
    setValue(convertFromUnits(balance).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      const willRecieve = parseFloat(0.99 * val).toFixed(2);
      setValue(val);
      setReceiveAmount(willRecieve);
    }
  };

  const handleProvideLiquidity = () => {
    toast?.pushSuccess({
      title: "Liquidity has been added",
      message: (
        <p className="flex">
          View transaction{" "}
          <OpenInNewIcon className="h-4 w-4 ml-2" fill="currentColor" />
        </p>
      ),
      lifetime: ERROR_TIMEOUT,
    });
  };

  const checkAllowance = async () => {
    try {
      const { result: _allowance } = await liquidity.getAllowance(
        chainId,
        coverKey,
        account,
        signerOrProvider
      );

      setAllowance(_allowance);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      let tx = await liquidity.approve(
        chainId,
        coverKey,
        { amount: convertToUnits(value).toString() },
        signerOrProvider
      );

      await tx.result.wait();

      setApproving(false);
      checkAllowance();
    } catch (error) {
      setApproving(false);
    }
  };

  const handleProvide = async () => {
    try {
      setProviding(true);

      const signerOrProvider = getProviderOrSigner(library, account, chainId);
      const amount = convertToUnits(value).toString();

      const tx = await liquidity.add(
        chainId,
        coverKey,
        amount,
        signerOrProvider
      );
      await tx.result.wait();

      setProviding(false);
    } catch (error) {
      setProviding(false);
    }
  };

  if (!fees && !maxValue) {
    return <>loading...</>;
  }

  const canProvideLiquidity =
    value &&
    !isValidNumber(value) &&
    isGreater(allowance || "0", convertToUnits(value || "0"));
  const isError =
    value &&
    (!isValidNumber(value) ||
      isGreater(convertToUnits(value || "0"), balance || "0"));

  return (
    <div className="max-w-md">
      <div className="pb-16">
        <TokenAmountInput
          labelText={"Enter Amount you wish to provide"}
          onInput={handleChange}
          handleChooseMax={handleChooseMax}
          error={isError}
          tokenAddress={assuranceTokenAddress}
          tokenSymbol={assuranceTokenSymbol}
          tokenBalance={balance}
          inputId={"cover-amount"}
          inputValue={value}
        />
      </div>

      <div className="pb-16">
        <ReceiveAmountInput
          labelText="You Will Receive"
          tokenSymbol="DAI"
          inputValue={receiveAmount}
          inputId="add-liquidity-receive"
        />
      </div>

      <div>
        <UnlockDate dateValue="September 22, 2021 12:34:00 PM UTC" />
      </div>

      {!canProvideLiquidity ? (
        <RegularButton
          disabled={isError || approving}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleApprove}
        >
          {approving ? "Approving..." : <>Provide Liquidity</>}
        </RegularButton>
      ) : (
        <RegularButton
          disabled={isError || providing}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleProvide}
        >
          {providing ? "Providing Liquidity..." : <>Provide Liquidity</>}
        </RegularButton>
      )}

      <div className="mt-16">
        <OutlinedButton className="rounded-big" onClick={() => router.back()}>
          &#x27F5;&nbsp;Back
        </OutlinedButton>
      </div>
    </div>
  );
};
