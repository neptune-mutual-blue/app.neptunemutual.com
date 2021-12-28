import { useState } from "react";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { InputWithTrailingButton } from "@/components/UI/atoms/input/with-trailing-button";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { amountFormatter } from "@/utils/formatter";
import { Dialog } from "@headlessui/react";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TabHeader } from "@/components/UI/molecules/tabheader";
import { HarvestForm } from "@/components/UI/organisms/pools/staking/harvest-form";
import { WithdrawForm } from "@/components/UI/organisms/pools/staking/withdraw-form";

const headers = [
  {
    name: "harvest",
    displayAs: "Harvest",
  },
  {
    name: "withdraw",
    displayAs: "Withdraw",
  },
];

export const CollectModal = ({
  id,
  isCollectModalOpen,
  onCollectModalClose,
  modalTitle,
  stakedAmount,
  earned,
}) => {
  const [activeTab, setActiveTab] = useState(headers[0].name);

  const handleHarvest = () => {
    //for further processing
    console.log("handleHarvest", id);
    onCollectModalClose();
  };

  const handleWithdraw = () => {
    //for further processing
    console.log("handleWithdraw", id);
    onCollectModalClose();
  };

  return (
    <Modal isOpen={isCollectModalOpen} onClose={onCollectModalClose}>
      <div className="max-w-xl w-full inline-block bg-F1F3F6 align-middle text-left py-12 rounded-3xl relative">
        <div className="px-12">
          <Dialog.Title className="font-sora font-bold text-h2">
            {modalTitle}
          </Dialog.Title>
        </div>

        <ModalCloseButton onClick={onCollectModalClose}></ModalCloseButton>

        <div className="mt-6">
          <TabHeader
            onClick={setActiveTab}
            headers={headers}
            activeTab={activeTab}
          />

          {activeTab == "harvest" ? (
            <HarvestForm
              stakedAmount={stakedAmount}
              earned={earned}
              onHarvest={handleHarvest}
            />
          ) : (
            <WithdrawForm onWithdraw={handleWithdraw} />
          )}
        </div>
      </div>
    </Modal>
  );
};
