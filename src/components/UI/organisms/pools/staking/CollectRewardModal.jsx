import { useEffect, useState } from "react";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { Dialog } from "@headlessui/react";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { TabHeader } from "@/components/UI/molecules/tabheader";
import { HarvestForm } from "@/components/UI/organisms/pools/staking/HarvestForm";
import { UnStakeForm } from "@/components/UI/organisms/pools/staking/UnStakeForm";
import {
  useStakingPoolWithdraw,
  useStakingPoolWithdrawRewards,
} from "@/src/hooks/useStakingPoolWithdraw";

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
  poolKey,
  stakedAmount,
  stakingTokenSymbol,
  rewardAmount,
  rewardTokenAddress,
  rewardTokenSymbol,
  isCollectModalOpen,
  onCollectModalClose,
  modalTitle,
}) => {
  const [activeTab, setActiveTab] = useState(headers[0].name);

  const { handleWithdraw, withdrawing } = useStakingPoolWithdrawRewards({
    poolKey,
  });

  //unstake form
  const [inputValue, setInputValue] = useState();

  const { withdrawing: unstaking, handleWithdraw: handleUnstaking } =
    useStakingPoolWithdraw({
      value: inputValue,
      tokenAddress: info.stakingToken,
      tokenSymbol: stakingTokenSymbol,
      poolKey,
    });

  // Clear on modal close
  useEffect(() => {
    if (isCollectModalOpen) return;

    setInputValue();
  }, [isCollectModalOpen]);

  return (
    <Modal
      isOpen={isCollectModalOpen}
      onClose={onCollectModalClose}
      disabled={withdrawing || unstaking}
    >
      <div className="max-w-xl w-full inline-block bg-f1f3f6 align-middle text-left py-12 rounded-3xl relative">
        <div className="px-12">
          <Dialog.Title className="font-sora font-bold text-h2 flex">
            {modalTitle}
          </Dialog.Title>
        </div>

        <ModalCloseButton
          disabled={withdrawing || unstaking}
          onClick={onCollectModalClose}
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
              handleWithdraw={handleWithdraw}
              withdrawing={withdrawing}
            />
          ) : (
            <UnStakeForm
              info={info}
              poolKey={poolKey}
              stakedAmount={stakedAmount}
              stakingTokenSymbol={stakingTokenSymbol}
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleUnstaking={handleUnstaking}
              unstaking={unstaking}
            />
          )}
        </div>
      </div>
    </Modal>
  );
};
