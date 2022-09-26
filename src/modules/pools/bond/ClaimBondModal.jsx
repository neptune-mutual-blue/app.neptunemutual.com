import * as Dialog from "@radix-ui/react-dialog";
import { RegularButton } from "@/common/Button/RegularButton";
import { DisabledInput } from "@/common/Input/DisabledInput";
import { Label } from "@/common/Label/Label";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";
import { formatAmount } from "@/utils/formatter";
import { convertFromUnits } from "@/utils/bn";
import { useClaimBond } from "@/src/hooks/useClaimBond";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { ModalWrapper } from "@/common/Modal/ModalWrapper";
import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useAppConstants } from "@/src/context/AppConstants";

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  claimable,
  isOpen,
  onClose,
  refetchBondInfo,
}) => {
  const { handleClaim, claiming } = useClaimBond();
  const router = useRouter();
  const { NPMTokenSymbol } = useAppConstants();

  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={claiming}>
      <ModalWrapper className="sm:min-w-600 bg-f1f3f6">
        <Dialog.Title className="font-bold font-sora text-h2">
          {modalTitle}
        </Dialog.Title>
        <ModalCloseButton
          disabled={claiming}
          onClick={onClose}
        ></ModalCloseButton>
        <div className="mt-6">
          <Label htmlFor={"claimable-bond"} className="mb-4 font-semibold">
            <Trans>Amount available to claim</Trans>
          </Label>
          <DisabledInput
            value={formatAmount(
              convertFromUnits(claimable).toString(),
              router.locale
            )}
            unit={NPMTokenSymbol}
          />
        </div>
        <div className="mt-8 modal-unlock">
          <Label className="mb-3" htmlFor="modal-unlock-on">
            <Trans>Unlock Date</Trans>
          </Label>
          <p
            id="modal-unlock-on"
            className="font-medium text-7398C0 text-h4"
            title={DateLib.toLongDateFormat(unlockDate, router.locale)}
          >
            {fromNow(unlockDate)}
          </p>
        </div>
        {/* left to add click handler */}
        <RegularButton
          disabled={claiming}
          onClick={() => {
            handleClaim(() => {
              onClose();
              refetchBondInfo();
            });
          }}
          className="w-full p-6 mt-8 font-semibold uppercase text-h6"
        >
          {claiming ? t`Claiming...` : t`Claim Now`}
        </RegularButton>
      </ModalWrapper>
    </ModalRegular>
  );
};
