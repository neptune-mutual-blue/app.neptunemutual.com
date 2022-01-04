import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";

export const ClaimCoverModal = ({
  modalTitle,
  unlockDate,
  claimableBond,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-lg w-full inline-block bg-F1F3F6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 w-full flex items-center">
          <img
            src="/_mocks/icons/okex.png"
            alt="policy"
            height={32}
            width={32}
          />
          <span className="pl-3">{modalTitle}</span>
        </Dialog.Title>
        <ModalCloseButton onClick={onClose}></ModalCloseButton>
        <div className="mt-6">
          <Label className="font-semibold mb-4">
            Amount Available To Claim
          </Label>
          <DisabledInput value={claimableBond} unit="NPM" />
        </div>
        <div className="modal-unlock mt-8">
          <Label className="mb-3" htmlFor="bond-amount">
            Unlock Date
          </Label>
          <p id="modal-unlock-on" className="text-7398C0 text-h4 font-medium">
            {unlockDate}
          </p>
        </div>
        {/* left to add click handler */}
        <RegularButton className="w-full mt-8 p-6 text-h6 uppercase font-semibold">
          Claim Now
        </RegularButton>
      </div>
    </Modal>
  );
};
