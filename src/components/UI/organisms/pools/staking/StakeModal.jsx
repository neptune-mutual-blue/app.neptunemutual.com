import * as Dialog from "@radix-ui/react-dialog";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useEffect, useState } from "react";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { convertFromUnits } from "@/utils/bn";
import { useStakingPoolDeposit } from "@/src/hooks/useStakingPoolDeposit";
import { explainInterval } from "@/utils/formatter/interval";

export const StakeModal = ({
  info,
  refetchInfo,
  poolKey,
  modalTitle,
  isOpen,
  onClose,
  stakingTokenSymbol,
  lockupPeriod,
}) => {
  const tokenAddress = info.stakingToken;
  const [inputValue, setInputValue] = useState();

  const {
    balance,
    maxStakableAmount,
    isError,
    errorMsg,
    canDeposit,
    approving,
    depositing,
    handleDeposit,
    handleApprove,
  } = useStakingPoolDeposit({
    refetchInfo,
    value: inputValue,
    tokenAddress,
    tokenSymbol: stakingTokenSymbol,
    poolKey,
    maximumStake: info.maximumStake,
  });

  useEffect(() => {
    if (isOpen) return;

    // Clear on modal close
    setInputValue();
  }, [isOpen]);

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(maxStakableAmount).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setInputValue(val);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={approving || depositing}>
      <div className="max-w-xl max-h-90vh overflow-y-auto w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex items-center">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={approving || depositing}
          onClick={onClose}
        ></ModalCloseButton>

        <div className="mt-6">
          <TokenAmountInput
            labelText={"Amount You Wish To Stake"}
            tokenBalance={balance}
            tokenSymbol={stakingTokenSymbol}
            tokenAddress={tokenAddress}
            handleChooseMax={handleChooseMax}
            inputValue={inputValue}
            id={"staked-amount"}
            disabled={approving || depositing}
            onChange={handleChange}
          >
            {errorMsg && (
              <p className="flex items-center text-FA5C2F">{errorMsg}</p>
            )}
          </TokenAmountInput>
        </div>
        <div className="modal-unlock mt-8">
          <Label className="mb-3" htmlFor="modal-unlock-on">
            Lockup Period
          </Label>
          <p id="modal-unlock-on" className="text-7398C0 text-h4 font-medium">
            {explainInterval(lockupPeriod)}
          </p>
        </div>

        {!canDeposit ? (
          <RegularButton
            disabled={isError || approving || !inputValue}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleApprove}
          >
            {approving ? "Approving..." : <>Approve {stakingTokenSymbol}</>}
          </RegularButton>
        ) : (
          <RegularButton
            disabled={isError || depositing}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={async () => {
              const isSuccess = await handleDeposit();
              isSuccess && onClose();
            }}
          >
            {depositing ? "Staking..." : "Stake"}
          </RegularButton>
        )}
      </div>
    </Modal>
  );
};
