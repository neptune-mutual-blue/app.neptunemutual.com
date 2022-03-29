import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";

import { ModalWrapper } from "@/components/UI/molecules/modal/modal-wrapper";
import { WithdrawLiquidityForm } from "@/components/LiquidityForms/WithdrawLiquidityForm";

export const WithdrawLiquidityModal = ({
  modalTitle,
  isOpen,
  onClose,
  info,
  refetchInfo,
}) => {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={isDisabled}>
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
    </Modal>
  );
};
