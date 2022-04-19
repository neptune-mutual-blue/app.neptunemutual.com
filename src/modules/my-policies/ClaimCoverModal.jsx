import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { DisabledInput } from "@/common/Input/DisabledInput";
import { Label } from "@/common/Label/Label";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";
import { RegularButton } from "@/common/Button/RegularButton";
import { TokenAmountInput } from "@/common/TokenAmountInput/TokenAmountInput";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useClaimPolicyInfo } from "@/src/hooks/useClaimPolicyInfo";
import { convertFromUnits, isGreater } from "@/utils/bn";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useCxTokenRowContext } from "@/src/modules/my-policies/CxTokenRowContext";
import { DataLoadingIndicator } from "@/common/DataLoadingIndicator";
import { formatPercent } from "@/utils/formatter/percent";
import { MULTIPLIER } from "@/src/config/constants";

export const ClaimCoverModal = ({
  modalTitle,
  isOpen,
  onClose,
  coverKey,
  incidentDate,
  cxTokenAddress,
}) => {
  const [value, setValue] = useState();
  const delayedValue = useDebounce(value, 200);
  const { balance, loadingBalance, tokenSymbol } = useCxTokenRowContext();
  const {
    canClaim,
    claiming,
    handleClaim,
    approving,
    handleApprove,
    receiveAmount,
    error,
    loadingAllowance,
    loadingFees,
    claimPlatformFee,
  } = useClaimPolicyInfo({
    value: delayedValue,
    cxTokenAddress,
    coverKey,
    incidentDate,
  });

  // Clear on modal close
  useEffect(() => {
    if (isOpen) return;

    setValue("");
  }, [isOpen]);

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const imgSrc = getCoverImgSrc({ key: coverKey });

  let loadingMessage = "";
  if (loadingBalance) {
    loadingMessage = "Fetching balance...";
  } else if (loadingAllowance) {
    loadingMessage = "Fetching allowance...";
  } else if (loadingFees) {
    loadingMessage = "Fetching fees...";
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={approving || claiming}
    >
      <div className="border-[1.5px] border-[#B0C4DB] relative inline-block w-full max-w-lg p-12 overflow-y-auto text-left align-middle min-w-300 lg:min-w-600 max-h-90vh bg-f1f3f6 rounded-3xl">
        <Dialog.Title className="flex items-center w-full font-bold font-sora text-h2">
          <img src={imgSrc} alt="policy" height={48} width={48} />
          <span className="pl-3">{modalTitle}</span>
        </Dialog.Title>
        <ModalCloseButton
          disabled={approving || claiming}
          onClick={onClose}
        ></ModalCloseButton>
        <div className="mt-6">
          <TokenAmountInput
            tokenAddress={cxTokenAddress}
            tokenSymbol={tokenSymbol}
            tokenBalance={balance}
            labelText={`Enter your ${tokenSymbol}`}
            handleChooseMax={handleChooseMax}
            inputValue={value}
            id={"bond-amount"}
            disabled={approving || claiming}
            onChange={handleChange}
            error={!!error}
          >
            {error && <p className="text-FA5C2F">{error}</p>}
          </TokenAmountInput>
        </div>
        <div className="mt-8 modal-unlock">
          <Label className="mb-4 font-semibold">You will receive</Label>
          <DisabledInput
            value={convertFromUnits(receiveAmount).toString()}
            unit="DAI"
          />
          <p className="px-3 pt-2 text-9B9B9B">
            {isGreater(claimPlatformFee, "0") &&
              `Fee: ${formatPercent(claimPlatformFee / MULTIPLIER)}`}
          </p>
        </div>

        <div className="mt-6">
          <DataLoadingIndicator message={loadingMessage} />
          {!canClaim ? (
            <RegularButton
              className="w-full p-6 font-semibold uppercase text-h6"
              disabled={!value || approving || error || loadingMessage}
              onClick={handleApprove}
            >
              {approving ? "Approving..." : "Approve"}
            </RegularButton>
          ) : (
            <RegularButton
              disabled={!canClaim || claiming || error || loadingMessage}
              className="w-full p-6 font-semibold uppercase text-h6"
              onClick={() =>
                handleClaim(() => {
                  setValue("");
                })
              }
            >
              {claiming ? "Claiming..." : "Claim"}
            </RegularButton>
          )}
        </div>
      </div>
    </ModalRegular>
  );
};
