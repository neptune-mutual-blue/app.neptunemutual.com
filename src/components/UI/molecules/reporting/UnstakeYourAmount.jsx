import { RegularButton } from "@/components/UI/atoms/button/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { useUnstakeReportingStake } from "@/src/hooks/useUnstakeReportingStake";
import { Dialog } from "@headlessui/react";
import { useState } from "react";

export const UnstakeYourAmount = ({ incidentReport }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { unstake, info } = useUnstakeReportingStake({
    coverKey: incidentReport.key,
    incidentDate: incidentReport.incidentDate,
  });

  function onClose() {
    setIsOpen(false);
  }

  return (
    <>
      <RegularButton className="px-10 py-4" onClick={() => setIsOpen(true)}>
        Unstake
      </RegularButton>
      <UnstakeModal
        isOpen={isOpen}
        onClose={onClose}
        unstake={unstake}
        info={info}
      />
    </>
  );
};

const UnstakeModal = ({ isOpen, onClose, unstake, info }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 flex">
          Unstake
        </Dialog.Title>

        <div className="my-4">
          <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>

        <RegularButton className="px-10 py-4" onClick={unstake}>
          Unstake
        </RegularButton>

        <ModalCloseButton onClick={onClose}></ModalCloseButton>
      </div>
    </Modal>
  );
};
