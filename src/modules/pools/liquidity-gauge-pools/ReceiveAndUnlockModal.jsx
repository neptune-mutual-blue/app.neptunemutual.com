import { RegularButton } from '@/common/Button/RegularButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import CloseIcon from '@/icons/CloseIcon'
import { MODAL_STATES } from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardAction'
import { useLiquidityGaugePoolWithdraw } from '@/src/hooks/useLiquidityGaugePoolWithdraw'
import { useLiquidityGaugePoolWithdrawRewards } from '@/src/hooks/useLiquidityGaugePoolWithdrawRewards'
import { convertFromUnits, toBN } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { Trans } from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/router'

export const ReceiveAndUnlockModal = ({
  modalTitle,
  isOpen,
  modalState,
  onClose,
  imgSrc,
  stakingTokenSymbol,
  stakingTokenDecimals,
  stakingTokenBalance,
  handleSwitch,
  stakingTokenAddress,
  inputValue,
  setInputValue,
  rewardTokenSymbol,
  rewardTokenDecimals,
  poolKey,
  rewardAmount
}) => {
  const { locale } = useRouter()

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setInputValue(val)
    }
  }

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(stakingTokenBalance, stakingTokenDecimals).toString())
  }

  const {
    canApprove,
    canWithdraw,
    handleApprove,
    handleWithdraw,
    approving,
    withdrawing
  } = useLiquidityGaugePoolWithdraw({
    stakingTokenAddress: stakingTokenAddress,
    amount: inputValue,
    poolKey
  })

  const { handleWithdrawRewards, withdrawingRewards } = useLiquidityGaugePoolWithdrawRewards({
    stakingTokenAddress: stakingTokenAddress,
    amount: inputValue,
    poolKey
  })

  const btnClass = 'w-full p-3 mt-6 font-semibold uppercase sm:min-w-auto sm:w-full'
  const closeModal = (approving || withdrawing || withdrawingRewards) ? () => {} : onClose

  const formattedBalance = formatCurrency(
    convertFromUnits(stakingTokenBalance, stakingTokenDecimals),
    locale,
    stakingTokenSymbol,
    true
  )

  const emissionReceived = formatCurrency(
    convertFromUnits(rewardAmount, rewardTokenDecimals),
    locale,
    rewardTokenSymbol
  )

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={closeModal}
      className='h-auto max-w-520'
      overlayProps={{ onClick: closeModal }}
    >
      <div className='w-full overflow-hidden bg-white border-B0C4DB rounded-2xl'>
        <ModalTitle
          showCloseBtn={!approving && !withdrawing && !withdrawingRewards}
          imgSrc={imgSrc}
          modalTitle={modalTitle}
          onClose={onClose}
        />

        <div className='px-8 py-6 pb-8'>
          <div className='mb-6'>
            <button
              type='button'
              onClick={() => handleSwitch(MODAL_STATES.RECEIVE)}
              className={classNames('px-4 py-2 text-sm font-semibold text-primary rounded-big',
                modalState === MODAL_STATES.RECEIVE && 'bg-DEEAF6'
              )}
            >
              Receive
            </button>

            <button
              type='button'
              onClick={() => handleSwitch('unlock')}
              className={classNames('px-4 py-2 text-sm font-semibold text-primary rounded-big',
                modalState === MODAL_STATES.UNLOCK && 'bg-DEEAF6'
              )}
            >
              Unlock
            </button>
          </div>

          {(modalState === MODAL_STATES.UNLOCK) && (
            <TokenAmountInput
              labelText='Enter Amount to Unlock'
              tokenBalance={stakingTokenBalance}
              tokenSymbol={stakingTokenSymbol}
              tokenAddress={stakingTokenAddress}
              handleChooseMax={handleChooseMax}
              inputValue={inputValue}
              id='token-amount'
              onChange={handleChange}
              inputId='modal-input'
              disabled={approving || withdrawing || withdrawingRewards}
            >
              {/* {errorMsg && (
                <p className='flex items-center text-FA5C2F'>{errorMsg}</p>
              )} */}
            </TokenAmountInput>
          )}

          <div className='flex flex-col gap-4 p-4 mt-6 bg-F3F5F7 rounded-big'>
            {(modalState === MODAL_STATES.RECEIVE) && (
              <>
                <div className='flex flex-row items-center justify-between text-sm'>
                  <span>Your Balance</span>
                  <span className='font-semibold'>
                    {formattedBalance.long}
                  </span>
                </div>
                <div className='flex flex-row items-center justify-between text-sm'>
                  <span>Emission Received</span>
                  <span className='font-semibold'>{emissionReceived.long}</span>
                </div>
              </>
            )}

            {(modalState === MODAL_STATES.UNLOCK) && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>Emission Received</span>
                <span className='font-semibold'>{emissionReceived.long}</span>
              </div>
            )}
          </div>

          {
            modalState === MODAL_STATES.UNLOCK && (
              canWithdraw
                ? (
                  <RegularButton
                    className={btnClass}
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                  >
                    <Trans>{withdrawing ? 'Unlocking...' : 'Unlock'}</Trans>
                  </RegularButton>
                  )
                : (
                  <RegularButton
                    className={btnClass}
                    disabled={!canApprove || approving}
                    onClick={handleApprove}
                  >
                    <Trans>{approving ? 'Approving...' : 'Approve'}</Trans>
                  </RegularButton>
                  )
            )
          }

          {
            modalState === MODAL_STATES.RECEIVE && (
              <RegularButton
                className={btnClass}
                disabled={!toBN(rewardAmount).isGreaterThan(0) || withdrawingRewards}
                onClick={handleWithdrawRewards}
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

export const ModalTitle = ({ showCloseBtn = true, onClose = () => {}, modalTitle, imgSrc }) => (
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
