import { useState } from 'react'

import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { TabHeader } from '@/common/Tab/TabHeader'
import { HarvestForm } from '@/src/modules/pools/staking/HarvestForm'
import { UnStakeForm } from '@/src/modules/pools/staking/UnStakeForm'
import * as Dialog from '@radix-ui/react-dialog'

const headers = [
  {
    name: 'collect',
    displayAs: 'Collect'
  },
  {
    name: 'withdraw',
    displayAs: 'Withdraw'
  }
]

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
  modalTitle
}) => {
  const [activeTab, setActiveTab] = useState(headers[0].name)
  const [isDisabled, setIsDisabled] = useState({ w: false, wr: false })

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={isDisabled.w || isDisabled.wr}
      data-testid='collect-reward-modal'
    >
      <ModalWrapper className='max-w-md bg-F6F7F9 xs:overflow-y-auto'>
        <div>
          <Dialog.Title className='flex font-bold text-display-sm'>
            {modalTitle}
          </Dialog.Title>
        </div>

        <ModalCloseButton
          disabled={isDisabled.w || isDisabled.wr}
          onClick={onClose}
        />

        <div className='mt-6 -mx-10 sm:-mx-12'>
          <TabHeader
            onClick={setActiveTab}
            headers={headers}
            activeTab={activeTab}
          />

          {activeTab === 'collect'
            ? (
              <HarvestForm
                info={info}
                stakedAmount={stakedAmount}
                rewardAmount={rewardAmount}
                rewardTokenAddress={rewardTokenAddress}
                stakingTokenSymbol={stakingTokenSymbol}
                rewardTokenSymbol={rewardTokenSymbol}
                poolKey={poolKey}
                refetchInfo={refetchInfo}
                setModalDisabled={setIsDisabled}
                onHarvestSuccess={onClose}
              />
              )
            : (
              <UnStakeForm
                info={info}
                poolKey={poolKey}
                stakedAmount={stakedAmount}
                stakingTokenSymbol={stakingTokenSymbol}
                refetchInfo={refetchInfo}
                setModalDisabled={setIsDisabled}
                onUnstakeSuccess={onClose}
              />
              )}
        </div>
      </ModalWrapper>
    </ModalRegular>
  )
}
