import { RegularButton } from "@/common/Button/RegularButton";
import { DisabledInput } from "@/common/Input/DisabledInput";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { CountDownTimer } from "@/src/modules/reporting/resolved/CountdownTimer";
import { classNames } from "@/lib/toast/utils";
import { getCoverImgSrc, isValidProduct } from "@/src/helpers/cover";
import { useUnstakeReportingStake } from "@/src/hooks/useUnstakeReportingStake";
import { convertFromUnits, isGreater } from "@/utils/bn";
import * as Dialog from "@radix-ui/react-dialog";
import DateLib from "@/lib/date/DateLib";
import { useState } from "react";
import { ModalWrapper } from "@/common/Modal/ModalWrapper";
import { t, Trans } from "@lingui/macro";
import { useAppConstants } from "@/src/context/AppConstants";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";
import { useRetryUntilPassed } from "@/src/hooks/useRetryUntilPassed";

export const UnstakeYourAmount = ({ incidentReport, willReceive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDiversified = isValidProduct(incidentReport.productKey);

  const coverInfo = useCoverOrProductData({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
  });

  const logoSrc = getCoverImgSrc({
    key: !isDiversified ? incidentReport.coverKey : incidentReport.productKey,
  });

  const { unstake, unstakeWithClaim, unstaking } = useUnstakeReportingStake({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate,
  });

  const isBeforeClaimExpire = useRetryUntilPassed(() => {
    const _now = DateLib.unix();
    return isGreater(incidentReport.claimExpiresAt, _now);
  }, true);

  const isAfterClaimStart = useRetryUntilPassed(() => {
    const _now = DateLib.unix();
    return isGreater(_now, incidentReport.claimBeginsFrom);
  }, true);

  if (!coverInfo) {
    return <Trans>loading...</Trans>;
  }

  const projectName = isDiversified
    ? coverInfo?.infoObj.productName
    : coverInfo?.infoObj.projectName;

  function onClose() {
    setIsOpen(false);
  }

  const now = DateLib.unix();

  const isIncidentOccurred = incidentReport.decision;
  const notClaimableYet = isGreater(incidentReport.claimBeginsFrom, now);
  const isClaimableNow =
    isIncidentOccurred && isBeforeClaimExpire && isAfterClaimStart;

  const handleUnstake = async () => {
    // For incident occurred, during claim period
    if (isIncidentOccurred && isClaimableNow) {
      await unstakeWithClaim();
      return;
    }

    // For false reporting, Before finalization
    if (!isIncidentOccurred && !incidentReport.finalized) {
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
        {incidentReport.decision ? t`Incident Occurred` : t`False Reporting`}{" "}
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
        reward={convertFromUnits(willReceive).decimalPlaces(2).toString()}
        logoSrc={logoSrc}
        logoAlt={projectName}
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
  const { NPMTokenSymbol } = useAppConstants();

  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={unstaking}>
      <ModalWrapper className="min-w-300 sm:min-w-500 lg:min-w-600">
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
          <DisabledInput value={reward} unit={NPMTokenSymbol} />
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
