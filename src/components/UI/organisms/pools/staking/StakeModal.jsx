import * as Dialog from "@radix-ui/react-dialog";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { ModalWrapper } from "@/components/UI/molecules/modal/modal-wrapper";
import { StakeForm } from "@/components/UI/organisms/pools/staking/StakeForm";

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
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // disabled={approving || depositing}
    >
      <ModalWrapper>
        <Dialog.Title className="flex items-center font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>

        <ModalCloseButton
          // disabled={approving || depositing}
          onClick={onClose}
        ></ModalCloseButton>

        <StakeForm
          refetchInfo={refetchInfo}
          info={info}
          poolKey={poolKey}
          stakingTokenSymbol={stakingTokenSymbol}
          lockupPeriod={lockupPeriod}
          modalOpen={isOpen}
        />
      </ModalWrapper>
    </Modal>
  );
};
