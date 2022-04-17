import { RegularButton } from "@/src/common/components/button/regular";
import { Radio } from "@/src/common/components/radio";
import { ModalCloseButton } from "@/src/common/components/modal/close-button";
import { Modal } from "@/src/common/components/modal/regular";
import { useResolveIncident } from "@/src/hooks/useResolveIncident";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { CountDownTimer } from "@/src/modules/reporting/resolved/CountdownTimer";
import { ModalWrapper } from "@/src/common/components/modal/modal-wrapper";

export const ResolveIncident = ({
  refetchReport,
  incidentReport,
  resolvableTill,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolve, emergencyResolve, resolving, emergencyResolving } =
    useResolveIncident({
      coverKey: incidentReport.key,
      incidentDate: incidentReport.incidentDate,
    });

  const { coverInfo } = useCoverInfo(incidentReport.key);
  const logoSource = getCoverImgSrc(coverInfo);

  function onClose() {
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col items-center">
      {incidentReport.resolved && (
        <CountDownTimer title="Resolving in" target={resolvableTill} />
      )}

      <div className="flex flex-wrap w-auto gap-10 mb-16">
        {!incidentReport.resolved && (
          <RegularButton
            disabled={resolving}
            className="w-full px-10 py-4 font-semibold uppercase md:w-80"
            onClick={async () => {
              await resolve();
              setTimeout(refetchReport, 15000);
            }}
          >
            {resolving ? "Resolving..." : "Resolve"}
          </RegularButton>
        )}

        <RegularButton
          className="w-full px-10 py-4 font-semibold uppercase md:w-80"
          onClick={() => setIsOpen(true)}
        >
          Emergency Resolve
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
    <Modal isOpen={isOpen} onClose={onClose} disabled={emergencyResolving}>
      <ModalWrapper>
        <Dialog.Title className="flex items-center">
          <img
            className="w-10 h-10 mr-3 border rounded-full"
            alt={logoAlt}
            src={logoSource}
          />
          <div className="font-bold font-sora text-h2">
            Emergency Resolution
          </div>
        </Dialog.Title>
        <div className="mt-8 mb-6 font-semibold uppercase">
          Select Your Decision
        </div>
        <div className="flex gap-4 my-4">
          <Radio
            label={"INCIDENT OCCURED"}
            id="decision-1"
            value="true"
            name="decision"
            disabled={emergencyResolving}
            onChange={handleRadioChange}
          />
          <Radio
            label={"FALSE REPORTING"}
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
          {emergencyResolving ? "Emergency Resolving..." : "EMERGENCY RESOLVE"}
        </RegularButton>

        <ModalCloseButton
          disabled={emergencyResolving}
          onClick={onClose}
        ></ModalCloseButton>
      </ModalWrapper>
    </Modal>
  );
};
