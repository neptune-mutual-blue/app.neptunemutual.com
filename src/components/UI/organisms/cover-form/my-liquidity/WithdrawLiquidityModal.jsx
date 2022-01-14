import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useEffect, useState } from "react";
import { useConstants } from "@/components/pages/cover/useConstants";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { ReceiveAmountInput } from "@/components/UI/organisms/receive-amount-input";
import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry, liquidity } from "@neptunemutual/sdk";
import { useRouter } from "next/router";
import {
  calculateGasMargin,
  convertFromUnits,
  convertToUnits,
} from "@/utils/bn";

export const WithdrawLiquidityModal = ({
  id,
  modalTitle,
  isOpen,
  onClose,
  unitName,
}) => {
  const router = useRouter();
  const [value, setValue] = useState();
  const [receiveAmount, setReceiveAmount] = useState();
  const [vaultTokenAddress, setVaultTokenAddress] = useState();
  const { maxValue } = useConstants();
  const { library, account, chainId } = useWeb3React();
  const [balance, setBalance] = useState();
  const coverKey = router.query.cover_id;

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    // POD Balance
    liquidity
      .getBalance(chainId, coverKey, signerOrProvider)
      .then(({ result }) => {
        if (ignore) return;
        setBalance(result);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, coverKey, library]);

  useEffect(() => {
    if (!chainId || !account) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    registry.Vault.getAddress(chainId, coverKey, signerOrProvider)
      .then((_vaultTokenAddress) => {
        if (ignore) return;
        setVaultTokenAddress(_vaultTokenAddress);
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, coverKey, library]);

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
    setReceiveAmount(parseFloat(0.99 * maxValue).toFixed(2));
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      const willRecieve = parseFloat(0.99 * val).toFixed(2);
      setValue(val);
      setReceiveAmount(willRecieve);
    }
  };

  const handleWithdraw = async (_id) => {
    if (!chainId || !account) return;

    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    try {
      const instance = await registry.Vault.getInstance(
        chainId,
        coverKey,
        signerOrProvider
      );
      const estimatedGas = await instance.estimateGas
        .removeLiquidity(coverKey, convertToUnits(value).toString())
        .catch(() =>
          instance.estimateGas.removeLiquidity(
            coverKey,
            convertToUnits(value).toString()
          )
        );

      const tx = await instance.removeLiquidity(
        coverKey,
        convertToUnits(value).toString(),
        {
          gasLimit: calculateGasMargin(estimatedGas),
        }
      );

      console.log(tx);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>

        <div className="mt-6">
          <TokenAmountInput
            labelText={"Enter your POD"}
            tokenSymbol={unitName}
            handleChooseMax={handleChooseMax}
            inputValue={value}
            id={"my-liquidity-amount"}
            onInput={handleChange}
            tokenBalance={balance}
            tokenAddress={vaultTokenAddress}
          />
        </div>
        <div className="modal-unlock mt-6">
          <ReceiveAmountInput
            labelText="You Will Receive"
            tokenSymbol="DAI"
            inputValue={receiveAmount}
            inputId="my-liquidity-receive"
          />
        </div>
        <RegularButton
          onClick={() => handleWithdraw(id)}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
          disabled={!value}
        >
          Withdraw
        </RegularButton>
      </div>
    </Modal>
  );
};
