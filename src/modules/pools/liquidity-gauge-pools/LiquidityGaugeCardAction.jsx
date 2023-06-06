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

export const MODAL_STATES = {
  LOCK: 'lock',
  ADD: 'add',
  RECEIVE: 'receive',
  UNLOCK: 'unlock',
  CLOSED: ''
}

export const LiquidityGaugeCardAction = ({
  lockupPeriod,
  stakingTokenIcon,
  stakingTokenSymbol,
  stakingTokenDecimals,
  stakingTokenBalance,
  stakingTokenAddress,
  poolKey,
  rewardTokenSymbol,
  rewardTokenDecimals,
  poolStaked,
  rewardAmount
}) => {
  const [modalState, setModalState] = useState(MODAL_STATES.CLOSED)

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    setInputValue('')
  }, [modalState])

  const handleReceiveModal = () => {
    setModalState(MODAL_STATES.RECEIVE)
  }

  const handleAddModal = () => {
    setModalState(MODAL_STATES.ADD)
  }

  const handleCloseModal = () => {
    setModalState(MODAL_STATES.CLOSED)
  }

  const handleSwitch = (value) => {
    setModalState(value)
  }

  const modalTitle = useMemo(() => {
    if (modalState === MODAL_STATES.LOCK) return `Lock ${stakingTokenSymbol}`
    if (modalState === MODAL_STATES.ADD) return `Add ${stakingTokenSymbol}`
    if (modalState === MODAL_STATES.RECEIVE) return `Receive ${stakingTokenSymbol}`
    if (modalState === MODAL_STATES.UNLOCK) return `Unlock ${stakingTokenSymbol}`
    return ''
  }, [modalState, stakingTokenSymbol])

  const isAddModalOpen = [
    MODAL_STATES.LOCK,
    MODAL_STATES.ADD
  ].includes(modalState)

  const isUnlockModalOpen = [
    MODAL_STATES.RECEIVE,
    MODAL_STATES.UNLOCK
  ].includes(modalState)

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
                onClick={() => setModalState(MODAL_STATES.LOCK)}
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
            modalState={modalState}
            onClose={handleCloseModal}
            modalTitle={modalTitle}
            imgSrc={stakingTokenIcon}
            lockupPeriod={lockupPeriod}
            stakingTokenAddress={stakingTokenAddress}
            stakingTokenDecimals={stakingTokenDecimals}
            stakingTokenSymbol={stakingTokenSymbol}
            stakingTokenBalance={stakingTokenBalance}
            inputValue={inputValue}
            setInputValue={setInputValue}
            poolKey={poolKey}
          />
        )
      }

      {
        isUnlockModalOpen && (
          <ReceiveAndUnlockModal
            isOpen={isUnlockModalOpen}
            modalState={modalState}
            onClose={handleCloseModal}
            modalTitle={modalTitle}
            imgSrc={stakingTokenIcon}
            stakingTokenSymbol={stakingTokenSymbol}
            stakingTokenDecimals={stakingTokenDecimals}
            stakingTokenBalance={stakingTokenBalance}
            handleSwitch={handleSwitch}
            stakingTokenAddress={stakingTokenAddress}
            inputValue={inputValue}
            setInputValue={setInputValue}
            rewardTokenSymbol={rewardTokenSymbol}
            rewardTokenDecimals={rewardTokenDecimals}
            poolKey={poolKey}
            rewardAmount={rewardAmount}
          />
        )
      }
    </>
  )
}
