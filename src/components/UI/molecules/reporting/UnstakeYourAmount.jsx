import { RegularButton } from "@/components/UI/atoms/button/regular";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { CountDownTimer } from "@/components/UI/molecules/reporting/CountdownTimer";
import { classNames } from "@/lib/toast/utils";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { useUnstakeReportingStake } from "@/src/hooks/useUnstakeReportingStake";
import { convertFromUnits, isGreater, sumOf } from "@/utils/bn";
import * as Dialog from "@radix-ui/react-dialog";
import DateLib from "@/lib/date/DateLib";
import { useState } from "react";
import { useRetryUntilPassed } from "@/src/hooks/useRetryUntilPassed";

export const UnstakeYourAmount = ({ incidentReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unstake, unstakeWithClaim, info, unstaking, unstakingWithClaim } =
    useUnstakeReportingStake({
      coverKey: incidentReport.key,
      incidentDate: incidentReport.incidentDate,
    });
  const { coverInfo } = useCoverInfo(incidentReport.key);
  const logoSrc = getCoverImgSrc(coverInfo);

  // Refreshes once claim begins
  useRetryUntilPassed(() => {
    return isGreater(incidentReport.claimBeginsFrom, DateLib.unix());
  }, false);

  // Refreshes once claim ends
  useRetryUntilPassed(() => {
    return isGreater(DateLib.unix(), incidentReport.claimExpiresAt);
  }, true);

  function onClose() {
    setIsOpen(false);
  }

  const now = DateLib.unix();

  const isIncidentOccured = incidentReport.decision;
  const notClaimableYet = isGreater(incidentReport.claimBeginsFrom, now);
  const isClaimableNow =
    isIncidentOccured &&
    isGreater(incidentReport.claimExpiresAt, now) &&
    isGreater(now, incidentReport.claimBeginsFrom);

  const handleUnstake = async () => {
    if (isIncidentOccured) {
      if (isClaimableNow) {
        await unstakeWithClaim();
        return;
      }

      // After claim expiry
      await unstake();
      return;
    }

    // For false reporting
    if (incidentReport.finalized) {
      await unstake();
      return;
    }

    // Before finalization
    await unstakeWithClaim();
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <span className={classNames("font-semibold", !isClaimableNow && "mb-4")}>
        Result:{" "}
        {incidentReport.decision ? "Incident Occured" : "False Reporting"}{" "}
        {incidentReport.emergencyResolved && "(Emergency Resolved)"}
      </span>

      {isClaimableNow && (
        <CountDownTimer
          title="CLAIM ENDS IN"
          target={incidentReport.claimExpiresAt}
        />
      )}

      {notClaimableYet && (
        <CountDownTimer
          title="CLAIM BEGINS IN"
          target={incidentReport.claimBeginsFrom}
        />
      )}

      <RegularButton
        className="px-10 py-4 mb-16 font-semibold w-full md:w-80"
        onClick={() => setIsOpen(true)}
      >
        UNSTAKE
      </RegularButton>

      <UnstakeModal
        isOpen={isOpen}
        onClose={onClose}
        unstake={handleUnstake}
        reward={convertFromUnits(
          sumOf(info.myStakeInWinningCamp, info.myReward)
            .minus(info.unstaken)
            .toString()
        )
          .decimalPlaces(2)
          .toString()}
        logoSrc={logoSrc}
        altName={coverInfo?.coverName}
        unstaking={unstaking}
        unstakingWithClaim={unstakingWithClaim}
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
  unstaking,
  unstakingWithClaim,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      disabled={unstaking || unstakingWithClaim}
    >
      <div className="sm:min-w-500 w-96 sm:w-auto max-w-xl inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
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
          {unstaking || unstakingWithClaim ? "UNSTAKING" : "UNSTAKE"}
        </RegularButton>

        <ModalCloseButton
          disabled={unstaking || unstakingWithClaim}
          onClick={onClose}
        ></ModalCloseButton>
      </div>
    </Modal>
  );
};
