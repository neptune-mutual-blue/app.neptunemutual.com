import { RegularButton } from "@/components/UI/atoms/button/regular";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal";
import { Dialog } from "@headlessui/react";
import { Close } from "@/icons/close_black.jsx";

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  onClick,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-lg w-full inline-block bg-E5E5E5 align-middle text-left p-12 rounded-lg relative">
        <Close onClick={onClose} className="absolute right-12 top-7" />
        <Dialog.Title className={"font-bold text-h2"}>
          {modalTitle}
        </Dialog.Title>
        <div className="mt-6">
          <Label className={"font-semibold mb-4"}>
            Amount Available To Claim
          </Label>
          <DisabledInput value={"33,660.00"} unit={"NPM"} />
        </div>
        <div className="modal-unlock mt-8 mb-8">
          <Label className="mb-3" htmlFor="bond-amount">
            Unlock Date
          </Label>
          <p id="modal-unlock-on" className="text-7398C0 text-h4 font-medium">
            {unlockDate}
          </p>
        </div>
        <RegularButton className={"p-6 w-full"} onClick={onClick}>
          Claim Now
        </RegularButton>
      </div>
    </Modal>
  );
};
