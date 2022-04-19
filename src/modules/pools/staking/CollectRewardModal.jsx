import { useState } from "react";
import { ModalRegular } from "@/common/Modal/ModalRegular";
import * as Dialog from "@radix-ui/react-dialog";
import { ModalCloseButton } from "@/common/Modal/ModalCloseButton";
import { TabHeader } from "@/common/Tab/TabHeader";
import { HarvestForm } from "@/src/modules/pools/staking/HarvestForm";
import { UnStakeForm } from "@/src/modules/pools/staking/UnStakeForm";
import { ModalWrapper } from "@/common/Modal/ModalWrapper";

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

export const CollectRewardModal = ({
  info,
  refetchInfo,
  poolKey,
  stakedAmount,
  stakingTokenSymbol,
  rewardAmount,
  rewardTokenAddress,
  rewardTokenSymbol,
  isOpen,
  onClose,
  modalTitle,
}) => {
  const [activeTab, setActiveTab] = useState(headers[0].name);
  const [isDisabled, setIsDisabled] = useState({ w: false, wr: false });

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={isDisabled.w || isDisabled.wr}
    >
      <ModalWrapper className="sm:min-w-600">
        <div className="px-12">
          <Dialog.Title className="flex font-bold font-sora text-h2">
            {modalTitle}
          </Dialog.Title>
        </div>

        <ModalCloseButton
          disabled={isDisabled.w || isDisabled.wr}
          onClick={onClose}
        ></ModalCloseButton>

        <div className="mt-6">
          <TabHeader
            onClick={setActiveTab}
            headers={headers}
            activeTab={activeTab}
          />

          {activeTab == "harvest" ? (
            <HarvestForm
              stakedAmount={stakedAmount}
              rewardAmount={rewardAmount}
              rewardTokenAddress={rewardTokenAddress}
              stakingTokenSymbol={stakingTokenSymbol}
              rewardTokenSymbol={rewardTokenSymbol}
              poolKey={poolKey}
              refetchInfo={refetchInfo}
              setModalDisabled={setIsDisabled}
            />
          ) : (
            <UnStakeForm
              info={info}
              poolKey={poolKey}
              stakedAmount={stakedAmount}
              stakingTokenSymbol={stakingTokenSymbol}
              refetchInfo={refetchInfo}
              setModalDisabled={setIsDisabled}
            />
          )}
        </div>
      </ModalWrapper>
    </ModalRegular>
  );
};
