import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { policy, registry } from "@neptunemutual/sdk";

import { getERC20Balance } from "@/utils/blockchain/getERC20Balance";
import { useWeb3React } from "@web3-react/core";

import InfoCircleIcon from "@/icons/info-circle";
import { useConstants } from "@/components/pages/cover/useConstants";
import { OutlinedButton } from "@/components/UI/atoms/button/outlined";
import { Radio } from "@/components/UI/atoms/radio";
import { PolicyFeesAndExpiry } from "@/components/UI/organisms/PolicyFeesAndExpiry/PolicyFeesAndExpiry";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { monthNames } from "@/lib/dates";
import {
  convertToUnits,
  convertFromUnits,
  isGreater,
  isValidNumber,
} from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { getERC20Allowance } from "@/utils/blockchain/getERC20Allowance";
import BigNumber from "bignumber.js";

export const CoverForm = ({
  assuranceTokenAddress,
  assuranceTokenSymbol,
  coverKey,
}) => {
  const router = useRouter();
  const { library, account, chainId } = useWeb3React();

  const [value, setValue] = useState();
  const [balance, setBalance] = useState();
  const [allowance, setAllowance] = useState();
  const [spender, setSpender] = useState();
  const [coverMonth, setCoverMonth] = useState();
  const [approving, setApproving] = useState();
  const [purchasing, setPurchasing] = useState();

  const { fees } = useConstants();

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;

    getERC20Balance(assuranceTokenAddress, library, account, chainId)
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

    getERC20Allowance(spender, assuranceTokenAddress, library, account, chainId)
      .then((bal) => {
        if (ignore) return;
        setAllowance(bal);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, assuranceTokenAddress, spender]);

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    registry.PolicyContract.getAddress(chainId, signerOrProvider)
      .then((addr) => {
        if (ignore) return;
        setSpender(addr);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, assuranceTokenAddress]);

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const handleRadioChange = (e) => {
    setCoverMonth(e.target.value);
  };

  const handleChooseMax = () => {
    if (!balance) {
      return;
    }
    setValue(convertFromUnits(balance).toString());
  };

  const checkApproved = async () => {
    await getERC20Allowance(
      spender,
      assuranceTokenAddress,
      library,
      account,
      chainId
    )
      .then((bal) => {
        setAllowance(bal);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      let tx = await policy.approve(chainId, {}, signerOrProvider);

      await tx.result.wait();

      setApproving(false);
      checkApproved();
    } catch (error) {
      setApproving(false);
    }
  };

  const handlePurchase = async () => {
    try {
      setPurchasing(true);
      const args = {
        duration: parseInt(coverMonth, 10),
        amount: convertToUnits(value).toString(), // <-- Amount to Cover (In DAI)
      };

      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const tx = await policy.purchaseCover(
        chainId,
        coverKey,
        args,
        signerOrProvider
      );
      await tx.result.wait();

      setPurchasing(false);
    } catch (error) {
      setPurchasing(false);
    }
  };

  if (!fees) {
    return <>loading...</>;
  }

  const now = new Date();
  const coverPeriodLabels = [
    monthNames[(now.getMonth() + 0) % 12],
    monthNames[(now.getMonth() + 1) % 12],
    monthNames[(now.getMonth() + 2) % 12],
  ];

  const canPurchase =
    value && isValidNumber(value) && isGreater(allowance || "0", value || "0");
  const isError =
    value &&
    (!isValidNumber(value) ||
      isGreater(convertToUnits(value || "0"), balance || "0"));

  return (
    <div className="max-w-md">
      <TokenAmountInput
        labelText={"Amount you wish to cover"}
        onInput={handleChange}
        error={isError}
        handleChooseMax={handleChooseMax}
        tokenAddress={assuranceTokenAddress}
        tokenSymbol={assuranceTokenSymbol}
        tokenBalance={balance}
        inputId={"cover-amount"}
        inputValue={value}
      >
        {value && isValidNumber(value) && (
          <div className="flex items-center text-15aac8">
            <p>You will receive: {new BigNumber(value).toString()} cxDAI</p>

            <button className="ml-3">
              <span className="sr-only">Info</span>
              <InfoCircleIcon width={24} fill="currentColor" />
            </button>
          </div>
        )}
      </TokenAmountInput>
      <div className="mt-12 px-3">
        <h5
          className="block uppercase text-black text-h6 font-semibold mb-4"
          htmlFor="cover-period"
        >
          Select your coverage period
        </h5>
        <div className="flex">
          <Radio
            label={coverPeriodLabels[0]}
            id="period-1"
            value="1"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label={coverPeriodLabels[1]}
            id="period-2"
            value="2"
            name="cover-period"
            onChange={handleRadioChange}
          />
          <Radio
            label={coverPeriodLabels[2]}
            id="period-3"
            value="3"
            name="cover-period"
            onChange={handleRadioChange}
          />
        </div>
      </div>
      {value && coverMonth && (
        <PolicyFeesAndExpiry
          fees={fees}
          daiValue={value}
          claimEnd={coverMonth}
        />
      )}

      {!canPurchase ? (
        <RegularButton
          disabled={isError || approving}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handleApprove}
        >
          {approving ? "Approving..." : <>Approve {assuranceTokenSymbol}</>}
        </RegularButton>
      ) : (
        <RegularButton
          disabled={isError || purchasing}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          onClick={handlePurchase}
        >
          {purchasing ? "Purchasing..." : "Purchase policy"}
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
