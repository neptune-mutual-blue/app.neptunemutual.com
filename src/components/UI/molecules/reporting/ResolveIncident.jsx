import { RegularButton } from "@/components/UI/atoms/button/regular";
import { Radio } from "@/components/UI/atoms/radio";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useResolveIncident } from "@/src/hooks/useResolveIncident";
import { unixToDate } from "@/utils/date";
import { Dialog } from "@headlessui/react";
import { useState } from "react";

export const ResolveIncident = ({ incidentReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { resolve, emergencyResolve } = useResolveIncident({
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });

  function onClose() {
    setIsOpen(false);
  }

  return (
    <div className="flex flex-col items-center">
      {incidentReport.resolved && (
        <div className="my-8">
          Resolving at:{" "}
          {unixToDate(
            incidentReport.claimBeginsFrom,
            "MMMM DD, YYYY hh:mm:ss A"
          )}{" "}
          UTC
        </div>
      )}

      <div className="flex gap-4">
        {!incidentReport.resolved && (
          <RegularButton className="px-10 py-4" onClick={resolve}>
            Resolve
          </RegularButton>
        )}

        {!incidentReport.emergencyResolved && (
          <RegularButton className="px-10 py-4" onClick={() => setIsOpen(true)}>
            Emergency Resolve
          </RegularButton>
        )}

        <EmergencyResolveModal
          isOpen={isOpen}
          onClose={onClose}
          emergencyResolve={emergencyResolve}
        />
      </div>
    </div>
  );
};

const EmergencyResolveModal = ({ isOpen, onClose, emergencyResolve }) => {
  const [decision, setDecision] = useState(null);

  const handleRadioChange = (e) => {
    setDecision(e.target.value);
    return;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
          Emergency Resolve
        </Dialog.Title>

        <div className="flex gap-4 my-4">
          <Radio
            label={"Incident Occurred"}
            id="decision-1"
            value="true"
            name="decision"
            onChange={handleRadioChange}
          />
          <Radio
            label={"False Reporting"}
            id="decision-2"
            value="false"
            name="decision"
            onChange={handleRadioChange}
          />
        </div>

        <RegularButton
          className="px-10 py-4"
          onClick={() => {
            emergencyResolve(decision === "true");
          }}
        >
          Emergency Resolve
        </RegularButton>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>
      </div>
    </Modal>
  );
};
