import {
  useEffect,
  useMemo,
  useState
} from 'react'

import AddIcon from '@/icons/AddIcon'
import {
  AddAndLockModal
} from '@/modules/pools/liquidity-gauge-pools/AddAndLockModal'
import {
  ReceiveAndUnlockModal
} from '@/modules/pools/liquidity-gauge-pools/ReceiveAndUnlockModal'
import { toBN } from '@/utils/bn'

export const LiquidityGaugeCardAction = ({
  lockupPeriodInBlocks,
  poolAddress,
  stakingTokenIcon,
  stakingTokenSymbol,
  stakingTokenDecimals,
  stakingTokenAddress,
  rewardTokenSymbol,
  rewardTokenDecimals,
  lockedByMe,
  rewardAmount,
  updateStakedAndReward
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue('')
  }, [isAddModalOpen, isUnlockModalOpen])

  const handleReceiveModal = () => {
    setIsUnlockModalOpen(true)
  }

  const handleAddModal = () => {
    setIsAddModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAddModalOpen(false)
    setIsUnlockModalOpen(false)
  }

  const addModalTitle = useMemo(() => {
    const isPoolStaked = toBN(lockedByMe).isGreaterThan(0)
    if (isAddModalOpen && isPoolStaked) { return `Add ${stakingTokenSymbol}` }
    if (isAddModalOpen && !isPoolStaked) { return `Lock ${stakingTokenSymbol}` }

    return ''
  }, [stakingTokenSymbol, isAddModalOpen, lockedByMe])

  return (
    <>
      <div className='mt-4 md:mt-0'>
        {toBN(lockedByMe).isZero()
          ? (
            <button
              onClick={() => { return setIsAddModalOpen(true) }}
              className='px-4 py-3 font-semibold tracking-wide text-white uppercase rounded-[10px] bg-primary hover:bg-opacity-90 w-full md:max-w-[216px] flex-auto'
            >
              Lock
            </button>
            )
          : (
            <div className='flex flex-row gap-2'>
              <button
                onClick={handleReceiveModal}
                className='px-4 py-3 font-semibold tracking-wide text-white uppercase rounded-[10px] bg-primary hover:bg-opacity-90  w-[156px] flex-auto'
              >
                Receive
              </button>
              <button
                onClick={handleAddModal}
                className='px-4 py-3 font-semibold tracking-wide uppercase rounded-[10px] bg-primary hover:bg-opacity-90'
              >
                <AddIcon className='w-5 h-5 fill-white' />
              </button>
            </div>
            )}
      </div>
      {
        isAddModalOpen && (
          <AddAndLockModal
            isOpen={isAddModalOpen}
            onClose={handleCloseModal}
            modalTitle={addModalTitle}
            imgSrc={stakingTokenIcon}
            lockupPeriodInBlocks={lockupPeriodInBlocks}
            stakingTokenAddress={stakingTokenAddress}
            stakingTokenDecimals={stakingTokenDecimals}
            stakingTokenSymbol={stakingTokenSymbol}
            inputValue={inputValue}
            setInputValue={setInputValue}
            poolAddress={poolAddress}
            updateStakedAndReward={updateStakedAndReward}
            poolStaked={lockedByMe}
          />
        )
      }

      {
        isUnlockModalOpen && (
          <ReceiveAndUnlockModal
            isOpen={isUnlockModalOpen}
            onClose={handleCloseModal}
            imgSrc={stakingTokenIcon}
            stakingTokenSymbol={stakingTokenSymbol}
            stakingTokenDecimals={stakingTokenDecimals}
            stakingTokenAddress={stakingTokenAddress}
            inputValue={inputValue}
            setInputValue={setInputValue}
            rewardTokenSymbol={rewardTokenSymbol}
            rewardTokenDecimals={rewardTokenDecimals}
            poolAddress={poolAddress}
            rewardAmount={rewardAmount}
            updateStakedAndReward={updateStakedAndReward}
            poolStaked={lockedByMe}
          />
        )
      }
    </>
  )
}
