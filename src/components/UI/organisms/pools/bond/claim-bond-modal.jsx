import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { useToast } from "@/lib/toast/context";
import OpenInNewIcon from "@/icons/open-in-new";
import { TOAST_ERROR_TIMEOUT } from "@/src/_mocks/utils";

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  claimableBond,
  isOpen,
  onClose,
}) => {
  const toast = useToast();

  const handleClaimNowClicked = () => {
    toast?.pushSuccess({
      title: "Bond Claimed Successfully",
      message: (
        <p className="flex">
          View transaction{" "}
          <OpenInNewIcon className="h-4 w-4 ml-2" fill="currentColor" />
        </p>
      ),
      lifetime: TOAST_ERROR_TIMEOUT,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-lg w-full inline-block bg-F1F3F6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2">
          {modalTitle}
        </Dialog.Title>
        <ModalCloseButton onClick={onClose}></ModalCloseButton>
        <div className="mt-6">
          <Label htmlFor={"claimable-bond"} className="font-semibold mb-4">
            Amount Available To Claim
          </Label>
          <DisabledInput
            id={"claimable-bond"}
            value={claimableBond}
            unit="NPM"
          />
        </div>
        <div className="modal-unlock mt-8">
          <Label className="mb-3" htmlFor="modal-unlock-on">
            Unlock Date
          </Label>
          <p id="modal-unlock-on" className="text-7398C0 text-h4 font-medium">
            {unlockDate}
          </p>
        </div>
        {/* left to add click handler */}
        <RegularButton
          onClick={handleClaimNowClicked}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        >
          Claim Now
        </RegularButton>
      </div>
    </Modal>
  );
};
