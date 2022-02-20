import { Dialog } from "@headlessui/react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { formatAmount } from "@/utils/formatter";
import { convertFromUnits } from "@/utils/bn";
import { useClaimBond } from "@/src/hooks/useClaimBond";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  claimable,
  isOpen,
  onClose,
}) => {
  const { handleClaim } = useClaimBond(unlockDate);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-lg w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2">
          {modalTitle}
        </Dialog.Title>
        <ModalCloseButton onClick={onClose}></ModalCloseButton>
        <div className="mt-6">
          <Label htmlFor={"claimable-bond"} className="font-semibold mb-4">
            Amount Available To Claim
          </Label>
          <DisabledInput
            value={formatAmount(convertFromUnits(claimable).toString())}
            unit="NPM"
          />
        </div>
        <div className="modal-unlock mt-8">
          <Label className="mb-3" htmlFor="modal-unlock-on">
            Unlock Date
          </Label>
          <p
            id="modal-unlock-on"
            className="text-7398C0 text-h4 font-medium"
            title={DateLib.toLongDateFormat(unlockDate)}
          >
            {fromNow(unlockDate)}
          </p>
        </div>
        {/* left to add click handler */}
        <RegularButton
          onClick={handleClaim}
          className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        >
          Claim Now
        </RegularButton>
      </div>
    </Modal>
  );
};
