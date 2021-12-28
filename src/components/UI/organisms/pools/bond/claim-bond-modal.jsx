import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal";
import CloseIcon from "@/icons/close.jsx";

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  claimableBond,
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-lg w-full inline-block bg-F1F3F6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2">
          {modalTitle}
        </Dialog.Title>
        <button
          onClick={onClose}
          className="absolute right-12 top-7 flex justify-center items-center text-gray-300 hover:text-black focus:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-364253 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="sr-only">Close</span>
          <CloseIcon width={24} />
        </button>
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
