import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Radio } from "@/components/UI/atoms/radio";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useResolveIncident } from "@/src/hooks/useResolveIncident";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { CountDownTimer } from "@/components/UI/molecules/reporting/CountdownTimer";

export const ResolveIncident = ({
  refetchReport,
  incidentReport,
  resolvableTill,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolve, emergencyResolve } = useResolveIncident({
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

      <div className="flex flex-wrap gap-10 mb-16 w-auto">
        {!incidentReport.resolved && (
          <RegularButton
            className="px-10 py-4 w-full md:w-80  font-semibold uppercase"
            onClick={async () => {
              await resolve();
              setTimeout(refetchReport, 15000);
            }}
          >
            Resolve
          </RegularButton>
        )}

        <RegularButton
          className="px-10 py-4 w-full md:w-80 font-semibold uppercase"
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
}) => {
  const [decision, setDecision] = useState(null);

  const handleRadioChange = (e) => {
    setDecision(e.target.value);
    return;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="flex items-center">
          <img
            className="w-10 h-10 mr-3 border rounded-full"
            alt={logoAlt}
            src={logoSource}
          />
          <div className="font-sora font-bold text-h2">
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
            onChange={handleRadioChange}
          />
          <Radio
            label={"FALSE REPORTING"}
            id="decision-2"
            value="false"
            name="decision"
            onChange={handleRadioChange}
          />
        </div>

        <RegularButton
          className="px-10 py-4 mt-12 w-full font-semibold"
          onClick={async () => {
            await emergencyResolve(decision === "true");
            setTimeout(refetchReport, 15000);
          }}
        >
          EMERGENCY RESOLVE
        </RegularButton>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>
      </div>
    </Modal>
  );
};
