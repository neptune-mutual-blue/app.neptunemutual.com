import { Label } from "@/components/UI/atoms/label";
import { useEffect, useState } from "react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Container } from "@/components/UI/atoms/container";
import { BondsCard } from "@/components/UI/organisms/pools/card";
import { ClaimBondModal } from "@/components/UI/organisms/pools/bond/claim-bond-modal";
import { mergeAlternatively } from "@/utils/arrays";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isValidNumber,
  sumOf,
  weiAsAmount,
} from "@/utils/bn";
import BigNumber from "bignumber.js";
import { AddressZero } from "@ethersproject/constants";
import { useAppContext } from "@/src/context/AppWrapper";
import { unixToDate } from "@/utils/date";
import dayjs from "dayjs";
import { useDebouncedEffect } from "@/src/hooks/useDebouncedEffect";

const defaultInfo = {
  lpTokenAddress: "",
  marketPrice: "0",
  discountRate: "0",
  vestingTerm: "0",
  maxBond: "0",
  totalNpmAllocated: "0",
  totalNpmDistributed: "0",
  npmAvailable: "0",
  bondContribution: "0",
  claimable: "0",
  unlockDate: "0",
};

const BondPage = () => {
  const [info, setInfo] = useState(defaultInfo);
  const [value, setValue] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [isOpen, setIsOpen] = useState(false);
  const [balance, setBalance] = useState("0");
  const [allowance, setAllowance] = useState();
  const [approving, setApproving] = useState();
  const [bonding, setBonding] = useState();

  const { chainId, account, library } = useWeb3React();
  const { networkId } = useAppContext();

  const canBond =
    value && isValidNumber(value) && isGreater(allowance || "0", value || "0");
  const isError =
    value &&
    (!isValidNumber(value) ||
      isGreater(convertToUnits(value || "0"), balance || "0"));

  const vestingTermDays = BigNumber(info.vestingTerm)
    .dividedBy(86400)
    .toString();

  const roi = weiAsAmount(
    BigNumber(info.discountRate)
      .multipliedBy(365)
      .dividedBy(vestingTermDays)
      .multipliedBy(100)
  );

  useEffect(() => {
    if (!networkId) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    const bondPoolInfo = async () => {
      let instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      );

      const [addresses, values] = await instance.getInfo(
        account || AddressZero
      );

      const [lpToken] = addresses;
      const [
        marketPrice,
        discountRate,
        vestingTerm,
        maxBond,
        totalNpmAllocated,
        totalNpmDistributed,
        npmAvailable,
        bondContribution,
        claimable,
        unlockDate,
      ] = values;

      setInfo({
        lpTokenAddress: lpToken,
        marketPrice: marketPrice.toString(),
        discountRate: discountRate.toString(),
        vestingTerm: vestingTerm.toString(),
        maxBond: maxBond.toString(),
        totalNpmAllocated: totalNpmAllocated.toString(),
        totalNpmDistributed: totalNpmDistributed.toString(),
        npmAvailable: npmAvailable.toString(),
        bondContribution: bondContribution.toString(),
        claimable: claimable.toString(),
        unlockDate: unlockDate.toString(),
      });
    };
    bondPoolInfo();
  }, [account, library, networkId]);

  useEffect(() => {
    if (!chainId || !account || !info.lpTokenAddress) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    const instance = registry.IERC20.getInstance(
      chainId,
      info.lpTokenAddress,
      signerOrProvider
    );

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
  }, [account, chainId, library, info.lpTokenAddress]);

  useDebouncedEffect(
    (ignore) => {
      if (!networkId || !value) return;

      async function updateReceiveAmount() {
        const instance = await registry.BondPool.getInstance(networkId);
        const result = await instance.calculateTokensForLp(
          convertToUnits(value).toString()
        );

        if (ignore) {
          console.log("ignoring", result.toString());
          return;
        }
        setReceiveAmount(weiAsAmount(result.toString()));
      }

      updateReceiveAmount();
    },
    [networkId, value],
    100
  );

  const leftHalf = [
    {
      title: "Bond Price",
      value: `$${convertToUnits("1")
        .minus(info.discountRate)
        .multipliedBy(info.marketPrice)
        .dividedBy(Math.pow(10, 18))
        .dividedBy(Math.pow(10, 18))
        .decimalPlaces(6)
        .toString()}`,
      valueClasses: "text-h3 text-4e7dd9 mt-1",
    },
    {
      title: "Maximum Bond",
      value: `${weiAsAmount(info.maxBond)} NPM-USDC LP`,
      valueClasses: "text-sm text-9B9B9B mt-1",
      titleClasses: "mt-7",
    },
  ];

  const rightHalf = [
    {
      title: "Market Price",
      value: `$${weiAsAmount(info.marketPrice)}`,
      valueClasses: "text-h3 text-9B9B9B mt-1",
    },
    {
      title: "Your Bond",
      value: `${weiAsAmount(info.bondContribution)} NPM`,
      titleClasses: `mt-7 ${!account && "hidden"}`,
      valueClasses: `text-sm text-9B9B9B mt-1 ${!account && "hidden"}`,
    },
  ];

  const details = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
  });

  const onOpen = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const checkAllowance = async () => {
    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);
      const instance = registry.IERC20.getInstance(
        chainId,
        info.lpTokenAddress,
        signerOrProvider
      );

      const bondContractAddress = await registry.BondPool.getAddress(
        chainId,
        signerOrProvider
      );

      if (!instance) {
        console.log("No instance found");
      }

      let result = await instance.allowance(account, bondContractAddress);
      setAllowance(convertFromUnits(result));
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const bondContractAddress = await registry.BondPool.getAddress(
        chainId,
        signerOrProvider
      );

      const instance = registry.IERC20.getInstance(
        chainId,
        info.lpTokenAddress,
        signerOrProvider
      );

      await instance.approve(
        bondContractAddress,
        convertToUnits(value).toString()
      );

      setApproving(false);

      checkAllowance();
    } catch (error) {
      setApproving(false);
    }
  };

  const handleBond = async () => {
    setBonding(true);

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    const instance = await registry.BondPool.getInstance(
      chainId,
      signerOrProvider
    );

    //TODO: passing minNpm desired (smart contract)
    let tx = await instance.createBond(
      convertToUnits(value).toString(),
      convertToUnits(value).toString()
    );

    setBonding(false);
  };

  const unlockTimestamp = sumOf(dayjs().unix(), info?.vestingTerm || "0");

  return (
    <Container className={"grid gap-16 grid-cols-1 lg:grid-cols-3 pt-16 pb-36"}>
      <div className="max-w-lg col-span-2">
        <TokenAmountInput
          tokenAddress={info.lpTokenAddress}
          tokenSymbol={"NPM-USDC-LP"}
          labelText={"Enter your amount"}
          handleChooseMax={handleChooseMax}
          inputValue={value}
          inputId={"bond-amount"}
          onChange={handleChange}
          tokenBalance={balance}
        />
        <div className="receive mt-16">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="NPM"
            inputValue={receiveAmount}
          />
        </div>

        <div className="unlock mt-16">
          <Label className="mb-2" htmlFor="unlock-on">
            Will Unlock On
          </Label>
          <p id="unlock-on" className="text-7398C0 text-h4 font-medium">
            {unixToDate(unlockTimestamp, "MMMM DD, YYYY hh:mm:ss A")} UTC
          </p>
        </div>

        {!canBond ? (
          <RegularButton
            disabled={isError || approving || !value}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve NPM-USDC LP</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={isError || bonding}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleBond}
          >
            {bonding ? "Bonding..." : "Bond NPM-USDC LP"}
          </RegularButton>
        )}
      </div>
      <div>
        <BondsCard
          handleClaimModal={onOpen}
          details={details}
          ROI={roi}
          vestingPeriod={vestingTermDays}
        />
      </div>
      {info.unlockDate && (
        <ClaimBondModal
          isOpen={isOpen}
          onClose={onClose}
          modalTitle={"Claim Bond"}
          unlockDate={info.unlockDate}
          claimableBond={info.claimable}
        />
      )}
    </Container>
  );
};

export default BondPage;
