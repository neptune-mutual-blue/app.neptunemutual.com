import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { ModalRegular } from "@/common/Modal/ModalRegular";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";

import { ModalWrapper } from "@/common/Modal/ModalWrapper";
import { WithdrawLiquidityForm } from "@/src/modules/my-liquidity/WithdrawLiquidityForm";

export const WithdrawLiquidityModal = ({
  modalTitle,
  isOpen,
  onClose,
  info,
  refetchInfo,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={isDisabled}>
      <ModalWrapper className="max-w-2xl">
        <Dialog.Title className="flex font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={isDisabled}
          onClick={onClose}
        ></ModalCloseButton>
        <WithdrawLiquidityForm
          info={info}
          refetchInfo={refetchInfo}
          setModalDisabled={setIsDisabled}
        />
      </ModalWrapper>
    </ModalRegular>
  );
};
