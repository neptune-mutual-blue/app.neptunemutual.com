import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import CloseIcon from '@/icons/CloseIcon'
import { convertFromUnits, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import {
  t,
  Trans
} from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'
import { MODAL_STATES } from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardAction'
import { classNames } from '@/utils/classnames'
import { explainInterval } from '@/utils/formatter/interval'

export const LockModal = ({
  modalTitle,
  isOpen,
  modalState,
  onClose,
  imgSrc,
  lockupPeriod,
  tokenSymbol,
  tokenDecimals,
  handleSwitch,
  stakingToken,
  inputValue,
  setInputValue,
  hookResult,
  locale,
  NPMTokenSymbol,
  NPMTokenDecimals
}) => {
  const router = useRouter()

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(8373.838).toString())
  }

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setInputValue(val)
    }
  }

  const {
    balance: tokenBalance,
    rewardAmount,
    canApprove,
    canSpend,
    handleApprove,
    handleDeposit,
    handleWithdraw,
    handleWithdrawRewards,
    approving,
    processingTx
  } = hookResult

  const inputLabel = t`Enter Amount You Wish to ${
    modalState === MODAL_STATES.LOCK
      ? 'Lock'
      : modalState === MODAL_STATES.ADD ? 'Add' : 'Unlock'
  }`

  const btnClass = 'w-full p-3 mt-6 font-semibold uppercase sm:min-w-auto sm:w-full'
  const closeModal = (approving || processingTx) ? () => {} : onClose

  const formattedBalance = formatCurrency(
    convertFromUnits(tokenBalance, tokenDecimals),
    router.locale,
    tokenSymbol,
    true
  )

  const emissionReceived = formatCurrency(
    convertFromUnits(rewardAmount, NPMTokenDecimals),
    locale,
    NPMTokenSymbol
  )

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={closeModal}
      className='max-w-520'
      overlayProps={{ onClick: closeModal }}
    >
      <div className='w-full overflow-hidden bg-white border-B0C4DB rounded-2xl'>
        <Dialog.Title
          className='relative flex justify-center w-full px-3 py-4 font-semibold border-b border-b-B0C4DB'
        >
          <div className='flex flex-row items-center gap-2.5'>
            {
              (!approving && !processingTx) && (
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

        <div className='px-8 py-6 pb-8'>
          {([MODAL_STATES.RECEIVE, MODAL_STATES.UNLOCK].includes(modalState)) && (
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
          )}

          {([MODAL_STATES.LOCK, MODAL_STATES.ADD, MODAL_STATES.UNLOCK].includes(modalState)) && (
            <TokenAmountInput
              labelText={inputLabel}
              tokenBalance={tokenBalance}
              tokenSymbol={tokenSymbol}
              tokenAddress={stakingToken}
              handleChooseMax={handleChooseMax}
              inputValue={inputValue}
              id='token-amount'
              onChange={handleChange}
              inputId='modal-input'
              disabled={approving || processingTx}
            >
              {/* {errorMsg && (
                <p className='flex items-center text-FA5C2F'>{errorMsg}</p>
              )} */}
            </TokenAmountInput>
          )}

          {([MODAL_STATES.ADD, MODAL_STATES.LOCK].includes(modalState)) && (
            canSpend
              ? (
                <RegularButton
                  className={btnClass}
                  onClick={handleDeposit}
                  disabled={processingTx}
                >
                  <Trans>{processingTx ? 'Locking...' : 'Lock'}</Trans>
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
          )}

          <div className='flex flex-col gap-4 p-4 mt-6 bg-F3F5F7 rounded-big'>
            {([MODAL_STATES.ADD, MODAL_STATES.LOCK].includes(modalState)) && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>Lockup Period</span>
                <span className='font-semibold'>{explainInterval(lockupPeriod)}</span>
              </div>
            )}

            {/* {modalState === MODAL_STATES.ADD && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>TVL</span>
                <span className='font-semibold'>{formatCurrency(1200000).short}</span>
              </div>
            )} */}

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

          {[MODAL_STATES.RECEIVE, MODAL_STATES.UNLOCK].includes(modalState) && (
            <>
              {
                modalState === MODAL_STATES.UNLOCK && (
                  canSpend
                    ? (
                      <RegularButton
                        className={btnClass}
                        onClick={handleWithdraw}
                        disabled={processingTx}
                      >
                        <Trans>{processingTx ? 'Unlocking...' : 'Unlock'}</Trans>
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
                    disabled={!toBN(rewardAmount).isGreaterThan(0) || processingTx}
                    onClick={handleWithdrawRewards}
                  >
                    <Trans>{processingTx ? 'Receiving...' : 'Receive'}</Trans>
                  </RegularButton>
                )
              }
            </>
          )}
        </div>
      </div>
    </ModalRegular>
  )
}
