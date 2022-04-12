import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { ModalWrapper } from "@/components/UI/molecules/modal/modal-wrapper";
import { StakeForm } from "@/src/modules/pools/staking/StakeForm";

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
  const [isDisabled, setIsDisabled] = useState(false);
  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={isDisabled}>
      <ModalWrapper>
        <Dialog.Title className="flex items-center font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          disabled={isDisabled}
          onClick={onClose}
        ></ModalCloseButton>

        <StakeForm
          info={info}
          refetchInfo={refetchInfo}
          poolKey={poolKey}
          onClose={onClose}
          stakingTokenSymbol={stakingTokenSymbol}
          lockupPeriod={lockupPeriod}
          setModalDisabled={setIsDisabled}
        />
      </ModalWrapper>
    </Modal>
  );
};
