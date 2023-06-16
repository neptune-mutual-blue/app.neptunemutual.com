import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import CloseIcon from '@/icons/CloseIcon'
import {
  useLiquidityGaugePoolWithdraw
} from '@/src/hooks/useLiquidityGaugePoolWithdraw'
import {
  useLiquidityGaugePoolWithdrawRewards
} from '@/src/hooks/useLiquidityGaugePoolWithdrawRewards'
import {
  convertFromUnits,
  convertToUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'

export const ReceiveAndUnlockModal = ({
  isOpen,
  onClose,
  imgSrc,
  stakingTokenSymbol,
  stakingTokenDecimals,
  stakingTokenAddress,
  inputValue,
  setInputValue,
  rewardTokenSymbol,
  rewardTokenDecimals,
  poolAddress,
  rewardAmount,
  updateStakedAndReward,
  poolStaked
}) => {
  const { locale } = useRouter()

  const [isExit, setIsExit] = useState(false)
  const [isReceiveRewardsModalOpen, setIsReceiveRewardsModalOpen] = useState(true)

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setInputValue(val)
    }
  }

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(poolStaked, stakingTokenDecimals).toString())
  }

  const {
    canWithdraw,
    handleWithdraw,
    withdrawing,
    error
  } = useLiquidityGaugePoolWithdraw({
    isExit,
    stakingTokenSymbol,
    stakingTokenDecimals,
    amountInUnits: convertToUnits(inputValue || '0', stakingTokenDecimals).toString(),
    poolAddress
  })

  const { handleWithdrawRewards, withdrawingRewards } = useLiquidityGaugePoolWithdrawRewards({
    poolAddress,
    rewardAmount,
    rewardTokenSymbol,
    rewardTokenDecimals
  })

  const btnClass = 'w-full p-3 mt-6 font-semibold uppercase sm:min-w-auto sm:w-full'
  const closeModal = useMemo(() => {
    return (withdrawing || withdrawingRewards) ? () => {} : onClose
  }, [onClose, withdrawing, withdrawingRewards])

  const emissionReceived = formatCurrency(
    convertFromUnits(rewardAmount, rewardTokenDecimals),
    locale,
    rewardTokenSymbol,
    true
  )

  const formattedStakedBalance = formatCurrency(
    convertFromUnits(poolStaked, stakingTokenDecimals),
    locale,
    stakingTokenSymbol,
    true
  )

  const modalTitle = isReceiveRewardsModalOpen
    ? `Receive ${rewardTokenSymbol}`
    : `Unlock ${stakingTokenSymbol}`

  useEffect(() => {
    if (toBN(poolStaked).isZero()) { closeModal() }
  }, [poolStaked, closeModal])

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={closeModal}
      className='h-auto max-w-520'
      overlayProps={{ onClick: closeModal }}
    >
      <div className='w-full overflow-hidden bg-white border-B0C4DB rounded-2xl'>
        <ModalTitle
          showCloseBtn={!withdrawing && !withdrawingRewards}
          imgSrc={imgSrc}
          modalTitle={modalTitle}
          onClose={onClose}
        />

        <div className='px-8 py-6 pb-8'>
          <div className='mb-6'>
            <button
              type='button'
              onClick={() => { return setIsReceiveRewardsModalOpen(true) }}
              className={classNames('px-4 py-2 text-sm font-semibold text-primary rounded-big',
                isReceiveRewardsModalOpen && 'bg-DEEAF6'
              )}
            >
              Receive
            </button>

            <button
              type='button'
              onClick={() => { return setIsReceiveRewardsModalOpen(false) }}
              className={classNames('px-4 py-2 text-sm font-semibold text-primary rounded-big',
                !isReceiveRewardsModalOpen && 'bg-DEEAF6'
              )}
            >
              Unlock
            </button>
          </div>

          {!isReceiveRewardsModalOpen && (
            <>
              <div className='flex items-center justify-between mt-6 mb-4'>
                <div className='font-semibold text-md'>Enter Amount to Unlock</div>
                <div className='flex items-center text-sm'>
                  <Checkbox
                    checked={isExit}
                    onChange={(e) => {
                      setIsExit(e.target.checked)
                      if (e.target.checked) {
                        handleChooseMax()
                      }
                    }}
                    className='w-4 h-4 m-0 border-gray-300 border-1 rounded-1' id='extend-checkbox'
                    labelClassName='ml-1'
                  >
                    Exit
                  </Checkbox>
                </div>
              </div>

              <TokenAmountInput
                labelText=''
                tokenBalance=''
                tokenSymbol={stakingTokenSymbol}
                tokenAddress={stakingTokenAddress}
                handleChooseMax={handleChooseMax}
                inputValue={inputValue}
                id='token-amount'
                onChange={handleChange}
                inputId='modal-input'
                disabled={withdrawing || withdrawingRewards || isExit}
              >
                <span title={formattedStakedBalance.long}>
                  Locked Balance: {formattedStakedBalance.short}
                </span>

                {(error) && (
                  <p className='flex items-center text-FA5C2F'>{error}</p>
                )}
              </TokenAmountInput>
            </>
          )}

          <div className='flex flex-col gap-4 p-4 mt-6 bg-F3F5F7 rounded-big'>
            {isReceiveRewardsModalOpen && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>Your Locked Balance</span>
                <span className='font-semibold' title={formattedStakedBalance.long}>
                  {formattedStakedBalance.short}
                </span>
              </div>
            )}

            <div className='flex flex-row items-center justify-between text-sm'>
              <span>Emission Received</span>
              <span className='font-semibold' title={emissionReceived.long}>
                {emissionReceived.short}
              </span>
            </div>
          </div>

          {
            !isReceiveRewardsModalOpen && (
              <RegularButton
                className={btnClass}
                onClick={() => {
                  return handleWithdraw(() => {
                    updateStakedAndReward()
                    setInputValue('')
                  })
                }}
                disabled={!canWithdraw || withdrawing}
              >
                <Trans>{withdrawing ? 'Unlocking...' : 'Unlock'}</Trans>
              </RegularButton>
            )
          }

          {
            isReceiveRewardsModalOpen && (
              <RegularButton
                className={btnClass}
                disabled={!toBN(rewardAmount).isGreaterThan(0) || withdrawingRewards}
                onClick={() => {
                  return handleWithdrawRewards(() => {
                    updateStakedAndReward()
                  })
                }}
              >
                <Trans>{withdrawingRewards ? 'Receiving...' : 'Receive'}</Trans>
              </RegularButton>
            )
          }

        </div>
      </div>
    </ModalRegular>
  )
}

export const ModalTitle = ({ showCloseBtn = true, onClose = () => {}, modalTitle, imgSrc }) => {
  return (
    <Dialog.Title
      className='relative flex justify-center w-full px-3 py-4 font-semibold border-b border-b-B0C4DB'
    >
      <div className='flex flex-row items-center gap-2.5'>
        {
        showCloseBtn && (
          <button
            aria-label='Close'
            onClick={onClose}
            className='absolute cursor-pointer right-4 top-[50%] -mt-[10px]'
            title='close'
          >
            <CloseIcon width={20} height={20} />
          </button>
        )
      }
        <img src={imgSrc} alt='token-logo' className='w-10 h-10' />

        <span className='text-xl'>
          {modalTitle}
        </span>
      </div>
    </Dialog.Title>
  )
}
