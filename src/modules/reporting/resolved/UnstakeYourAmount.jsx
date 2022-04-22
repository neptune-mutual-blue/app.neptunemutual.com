import { RegularButton } from "@/common/Button/RegularButton";
import { DisabledInput } from "@/common/Input/DisabledInput";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { CountDownTimer } from "@/src/modules/reporting/resolved/CountdownTimer";
import { classNames } from "@/lib/toast/utils";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { useUnstakeReportingStake } from "@/src/hooks/useUnstakeReportingStake";
import { convertFromUnits, isGreater } from "@/utils/bn";
import * as Dialog from "@radix-ui/react-dialog";
import DateLib from "@/lib/date/DateLib";
import { useState } from "react";
import { useRetryUntilPassed } from "@/src/hooks/useRetryUntilPassed";
import { ModalWrapper } from "@/common/Modal/ModalWrapper";
import { t, Trans } from "@lingui/macro";

export const UnstakeYourAmount = ({ incidentReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unstake, unstakeWithClaim, info, unstaking } =
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
    // For incident occured, during claim period
    if (isIncidentOccured && isClaimableNow) {
      await unstakeWithClaim();
      return;
    }

    // For false reporting, Before finalization
    if (!isIncidentOccured && !incidentReport.finalized) {
      await unstakeWithClaim();
      return;
    }

    await unstake();
    return;
  };

  return (
    <div className="flex flex-col items-center pt-4">
      <span className={classNames("font-semibold", !isClaimableNow && "mb-4")}>
        <Trans>Result:</Trans>{" "}
        {incidentReport.decision ? t`Incident Occured` : t`False Reporting`}{" "}
        {incidentReport.emergencyResolved && t`(Emergency Resolved)`}
      </span>

      {isClaimableNow && (
        <CountDownTimer
          title={t`CLAIM ENDS IN`}
          target={incidentReport.claimExpiresAt}
        />
      )}

      {notClaimableYet && (
        <CountDownTimer
          title={t`CLAIM BEGINS IN`}
          target={incidentReport.claimBeginsFrom}
        />
      )}

      <RegularButton
        className="w-full px-10 py-4 mb-16 font-semibold md:w-80"
        onClick={() => setIsOpen(true)}
      >
        <Trans>UNSTAKE</Trans>
      </RegularButton>

      <UnstakeModal
        isOpen={isOpen}
        onClose={onClose}
        unstake={handleUnstake}
        reward={convertFromUnits(info.willReceive).decimalPlaces(2).toString()}
        logoSrc={logoSrc}
        altName={coverInfo?.coverName}
        unstaking={unstaking}
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
}) => {
  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={unstaking}>
      <ModalWrapper className="sm:min-w-500 md:min-w-600">
        <Dialog.Title className="flex items-center">
          <img
            className="w-10 h-10 mr-3 border rounded-full"
            alt={logoAlt}
            src={logoSrc}
          />
          <span className="font-bold font-sora text-h2">
            <Trans>Unstake</Trans>
          </span>
        </Dialog.Title>

        <div className="my-8">
          <div className="mb-5 font-semibold">
            <Trans>YOU WILL RECEIVE</Trans>
          </div>
          <DisabledInput value={reward} unit="NPM" />
        </div>

        <RegularButton
          disabled={unstaking}
          className="w-full px-10 py-4 font-semibold uppercase"
          onClick={unstake}
        >
          {unstaking ? t`Unstaking...` : t`Unstake`}
        </RegularButton>

        <ModalCloseButton
          disabled={unstaking}
          onClick={onClose}
        ></ModalCloseButton>
      </ModalWrapper>
    </ModalRegular>
  );
};
