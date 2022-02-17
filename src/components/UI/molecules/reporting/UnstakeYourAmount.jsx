import { RegularButton } from "@/components/UI/atoms/button/regular";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { CountDownTimer } from "@/components/UI/molecules/reporting/CountdownTimer";
import { classNames } from "@/lib/toast/utils";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { useUnstakeReportingStake } from "@/src/hooks/useUnstakeReportingStake";
import { isGreater } from "@/utils/bn";
import { Dialog } from "@headlessui/react";
import DateLib from "@/lib/date/DateLib";
import { useState } from "react";

export const UnstakeYourAmount = ({ incidentReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unstake, unstakeWithClaim, info } = useUnstakeReportingStake({
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });
  const { coverInfo } = useCoverInfo(incidentReport.key);
  const logoSrc = getCoverImgSrc(coverInfo);

  function onClose() {
    setIsOpen(false);
  }

  const now = DateLib.unix();

  const isClaimableNow =
    incidentReport.decision &&
    isGreater(incidentReport.claimExpiresAt, now) &&
    isGreater(now, incidentReport.claimBeginsFrom);

  const handleUnstake = isClaimableNow ? unstakeWithClaim : unstake;

  return (
    <div className="flex flex-col items-center pt-4">
      <span className={classNames("font-semibold", !isClaimableNow && "mb-4")}>
        Result: Incident Occured
      </span>
      {isClaimableNow && (
        <CountDownTimer startingTime="00:00:00" title="CLAIM ENDS IN" />
      )}
      <RegularButton
        className="px-10 py-4 mb-16 font-bold w-80"
        onClick={() => setIsOpen(true)}
      >
        UNSTAKE
      </RegularButton>

      <UnstakeModal
        isOpen={isOpen}
        onClose={onClose}
        unstake={handleUnstake}
        reward={+info.myStakeInWinningCamp + +info.myReward}
        logoSrc={logoSrc}
        altName={coverInfo?.coverName}
      />
    </div>
  );
};

const UnstakeModal = ({
  isOpen,
  onClose,
  unstake,
  reward,
  logoSrc,
  logoAlt,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="flex items-center">
          <img
            className="w-10 h-10 mr-3 border rounded-full"
            alt={logoAlt}
            src={logoSrc}
          />
          <span className="font-sora font-bold text-h2">Unstake</span>
        </Dialog.Title>

        <div className="my-8">
          <div className="font-semibold mb-5">YOU WILL RECEIVE</div>
          <DisabledInput value={reward} unit="NPM" />
        </div>

        <RegularButton
          className="px-10 py-4 w-full font-semibold"
          onClick={unstake}
        >
          UNSTAKE
        </RegularButton>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>
      </div>
    </Modal>
  );
};
