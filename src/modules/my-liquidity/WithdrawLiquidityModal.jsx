import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { ModalRegular } from "@/common/components/Modal/ModalRegular";
import { ModalCloseButton } from "@/common/components/Modal/ModalCloseButton";

import { ModalWrapper } from "@/common/components/Modal/ModalWrapper";
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
      <ModalWrapper>
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
