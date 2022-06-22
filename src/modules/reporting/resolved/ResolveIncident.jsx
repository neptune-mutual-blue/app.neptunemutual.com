import { RegularButton } from "@/common/Button/RegularButton";
import { Radio } from "@/common/Radio/Radio";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import { useResolveIncident } from "@/src/hooks/useResolveIncident";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { CountDownTimer } from "@/src/modules/reporting/resolved/CountdownTimer";
import { ModalWrapper } from "@/common/Modal/ModalWrapper";
import { t, Trans } from "@lingui/macro";
import { safeFormatBytes32String } from "@/utils/formatter/bytes32String";
import { useRouter } from "next/router";
import { useCoverOrProductData } from "@/src/hooks/useCoverOrProductData";

export const ResolveIncident = ({
  refetchReport,
  incidentReport,
  resolvableTill,
}) => {
  const router = useRouter();
  const { product_id } = router.query;
  const [isOpen, setIsOpen] = useState(false);
  const productKey = safeFormatBytes32String(product_id || "");
  const { resolve, emergencyResolve, resolving, emergencyResolving } =
    useResolveIncident({
      coverKey: incidentReport.coverKey,
      productKey: productKey,
      incidentDate: incidentReport.incidentDate,
    });

  const coverInfo = useCoverOrProductData({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
  });
  const logoSource = getCoverImgSrc({ key: incidentReport.coverKey });

  if (!coverInfo) {
    return <Trans>loading...</Trans>;
  }

  function onClose() {
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col items-center">
      {incidentReport.resolved && (
        <CountDownTimer title={t`Resolving in`} target={resolvableTill} />
      )}

      <div className="flex flex-wrap justify-center w-auto gap-10 mb-16">
        {!incidentReport.resolved && (
          <RegularButton
            disabled={resolving}
            className="w-full px-10 py-4 font-semibold uppercase md:w-80"
            onClick={async () => {
              await resolve();
              setTimeout(refetchReport, 15000);
            }}
          >
            {resolving ? t`Resolving...` : t`Resolve`}
          </RegularButton>
        )}

        <RegularButton
          className="w-full px-10 py-4 font-semibold uppercase md:w-80"
          onClick={() => setIsOpen(true)}
        >
          <Trans>Emergency Resolve</Trans>
        </RegularButton>

        <EmergencyResolveModal
          isOpen={isOpen}
          onClose={onClose}
          refetchReport={refetchReport}
          emergencyResolve={emergencyResolve}
          logoSource={logoSource}
          logoAlt={coverInfo?.coverName}
          emergencyResolving={emergencyResolving}
        />
      </div>
    </div>
  );
};

const EmergencyResolveModal = ({
  isOpen,
  onClose,
  refetchReport,
  emergencyResolve,
  logoSource,
  logoAlt,
  emergencyResolving,
}) => {
  const [decision, setDecision] = useState(null);

  const handleRadioChange = (e) => {
    setDecision(e.target.value);
    return;
  };

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={emergencyResolving}
    >
      <ModalWrapper className="max-w-sm sm:max-w-none">
        <Dialog.Title className="flex items-center">
          <img
            className="w-10 h-10 mr-3 border rounded-full"
            alt={logoAlt}
            src={logoSource}
          />
          <div className="font-bold font-sora text-h2">
            <Trans>Emergency Resolution</Trans>
          </div>
        </Dialog.Title>
        <div className="mt-8 mb-6 font-semibold uppercase">
          <Trans>Select Your Decision</Trans>
        </div>
        <div className="flex flex-col gap-4 my-4 sm:flex-row">
          <Radio
            label={t`INCIDENT OCCURED`}
            id="decision-1"
            value="true"
            name="decision"
            disabled={emergencyResolving}
            onChange={handleRadioChange}
          />
          <Radio
            label={t`FALSE REPORTING`}
            id="decision-2"
            value="false"
            name="decision"
            disabled={emergencyResolving}
            onChange={handleRadioChange}
          />
        </div>

        <RegularButton
          disabled={emergencyResolving}
          className="w-full px-10 py-4 mt-12 font-semibold uppercase"
          onClick={async () => {
            await emergencyResolve(decision === "true");
            setTimeout(refetchReport, 15000);
          }}
        >
          {emergencyResolving
            ? t`Emergency Resolving...`
            : t`EMERGENCY RESOLVE`}
        </RegularButton>

        <ModalCloseButton
          disabled={emergencyResolving}
          onClick={onClose}
        ></ModalCloseButton>
      </ModalWrapper>
    </ModalRegular>
  );
};
