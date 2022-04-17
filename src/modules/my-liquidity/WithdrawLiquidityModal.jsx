import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import { Modal } from "@/src/common/components/modal/regular";
import { ModalCloseButton } from "@/src/common/components/modal/close-button";

import { ModalWrapper } from "@/src/common/components/modal/modal-wrapper";
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
