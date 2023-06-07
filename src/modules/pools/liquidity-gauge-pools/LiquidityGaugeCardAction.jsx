import {
  useEffect,
  useMemo,
  useState
} from 'react'

import AddIcon from '@/icons/AddIcon'

import { toBN } from '@/utils/bn'
import { explainInterval } from '@/utils/formatter/interval'
import { AddAndLockModal } from '@/modules/pools/liquidity-gauge-pools/AddAndLockModal'
import { ReceiveAndUnlockModal } from '@/modules/pools/liquidity-gauge-pools/ReceiveAndUnlockModal'

export const LiquidityGaugeCardAction = ({
  lockupPeriod,
  stakingTokenIcon,
  stakingTokenSymbol,
  stakingTokenDecimals,
  stakingTokenAddress,
  poolKey,
  rewardTokenSymbol,
  rewardTokenDecimals,
  poolStaked,
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
    const isPoolStaked = toBN(poolStaked).isGreaterThan(0)
    if (isAddModalOpen && isPoolStaked) return `Add ${stakingTokenSymbol}`
    if (isAddModalOpen && !isPoolStaked) return `Lock ${stakingTokenSymbol}`
    return ''
  }, [stakingTokenSymbol, isAddModalOpen, poolStaked])

  return (
    <>
      <div className='flex flex-col justify-between mt-6 md:mt-0 md:flex-row md:items-center'>
        <div className='flex flex-col gap-1'>
          <div className='text-sm text-999BAB'>
            Lockup Period:{' '}
            <span className='font-semibold text-01052D'>
              {explainInterval(lockupPeriod)}
            </span>
          </div>
          {/* <div className='flex flex-row items-center gap-1'>
            <div className='text-sm text-999BAB'>Reward Tokens:</div>
            <InfoTooltip infoComponent={`${tokenName} Token`} className='text-xs px-2 py-0.75 bg-opacity-100'>
              <button type='button' className='cursor-default'><img src={tokenIcon} alt='npm_icon' className='w-6' /></button>
            </InfoTooltip>
          </div> */}
        </div>

        <div className='mt-4 md:mt-0'>
          {toBN(poolStaked).isZero()
            ? (
              <button
                onClick={() => setIsAddModalOpen(true)}
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
      </div>

      {
        isAddModalOpen && (
          <AddAndLockModal
            isOpen={isAddModalOpen}
            onClose={handleCloseModal}
            modalTitle={addModalTitle}
            imgSrc={stakingTokenIcon}
            lockupPeriod={lockupPeriod}
            stakingTokenAddress={stakingTokenAddress}
            stakingTokenDecimals={stakingTokenDecimals}
            stakingTokenSymbol={stakingTokenSymbol}
            inputValue={inputValue}
            setInputValue={setInputValue}
            poolKey={poolKey}
            updateStakedAndReward={updateStakedAndReward}
            poolStaked={poolStaked}
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
            poolKey={poolKey}
            rewardAmount={rewardAmount}
            updateStakedAndReward={updateStakedAndReward}
            poolStaked={poolStaked}
          />
        )
      }
    </>
  )
}
