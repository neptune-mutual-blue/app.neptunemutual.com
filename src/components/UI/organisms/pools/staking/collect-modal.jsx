import { useState } from "react";
import { Modal } from "@/components/UI/molecules/modal/regular";
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
  info,
  poolKey,
  stakedAmount,
  stakingTokenSymbol,
  rewardAmount,
  rewardTokenSymbol,
  isCollectModalOpen,
  onCollectModalClose,
  modalTitle,
}) => {
  const [activeTab, setActiveTab] = useState(headers[0].name);

  return (
    <Modal isOpen={isCollectModalOpen} onClose={onCollectModalClose}>
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left py-12 rounded-3xl relative">
        <div className="px-12">
          <Dialog.Title className="font-sora font-bold text-h2 flex">
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
              poolKey={poolKey}
              stakedAmount={stakedAmount}
              rewardAmount={rewardAmount}
              stakingTokenSymbol={stakingTokenSymbol}
              rewardTokenSymbol={rewardTokenSymbol}
            />
          ) : (
            <WithdrawForm
              info={info}
              poolKey={poolKey}
              stakedAmount={stakedAmount}
              stakingTokenSymbol={stakingTokenSymbol}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
