import * as Dialog from "@radix-ui/react-dialog";
import { RegularButton } from "@/src/common/components/button/regular";
import { DisabledInput } from "@/src/common/components/input/disabled-input";
import { Label } from "@/src/common/components/label";
import { Modal } from "@/src/common/components/modal/regular";
import { ModalCloseButton } from "@/src/common/components/modal/close-button";
import { formatAmount } from "@/utils/formatter";
import { convertFromUnits } from "@/utils/bn";
import { useClaimBond } from "@/src/hooks/useClaimBond";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { ModalWrapper } from "@/src/common/components/modal/modal-wrapper";

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  claimable,
  isOpen,
  onClose,
  refetchBondInfo,
}) => {
  const { handleClaim, claiming } = useClaimBond();

  return (
    <Modal isOpen={isOpen} onClose={onClose} disabled={claiming}>
      <ModalWrapper className="sm:min-w-600">
        <Dialog.Title className="font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>
        <ModalCloseButton
          disabled={claiming}
          onClick={onClose}
        ></ModalCloseButton>
        <div className="mt-6">
          <Label htmlFor={"claimable-bond"} className="mb-4 font-semibold">
            Amount Available To Claim
          </Label>
          <DisabledInput
            value={formatAmount(convertFromUnits(claimable).toString())}
            unit="NPM"
          />
        </div>
        <div className="mt-8 modal-unlock">
          <Label className="mb-3" htmlFor="modal-unlock-on">
            Unlock Date
          </Label>
          <p
            id="modal-unlock-on"
            className="font-medium text-7398C0 text-h4"
            title={DateLib.toLongDateFormat(unlockDate)}
          >
            {fromNow(unlockDate)}
          </p>
        </div>
        {/* left to add click handler */}
        <RegularButton
          disabled={claiming}
          onClick={async () => {
            await handleClaim(() => {
              onClose();
              refetchBondInfo();
            });
          }}
          className="w-full p-6 mt-8 font-semibold uppercase text-h6"
        >
          {claiming ? "Claiming..." : "Claim Now"}
        </RegularButton>
      </ModalWrapper>
    </Modal>
  );
};
