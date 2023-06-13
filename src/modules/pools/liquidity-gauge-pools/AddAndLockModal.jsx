
import { RegularButton } from '@/common/Button/RegularButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import {
  MODAL_STATES
} from '@/modules/pools/liquidity-gauge-pools/LiquidityGaugeCardAction'
import { ModalTitle } from '@/modules/pools/liquidity-gauge-pools/ReceiveAndUnlockModal'
import { useLiquidityGaugePoolDeposit } from '@/src/hooks/useLiquidityGaugePoolDeposit'
import { convertFromUnits } from '@/utils/bn'

import { explainInterval } from '@/utils/formatter/interval'
import {
  t,
  Trans
} from '@lingui/macro'

export const AddAndLockModal = ({
  modalTitle,
  isOpen,
  modalState,
  onClose,
  imgSrc,
  lockupPeriod,
  stakingTokenAddress,
  stakingTokenDecimals,
  stakingTokenSymbol,
  stakingTokenBalance,
  inputValue,
  setInputValue,
  poolKey
}) => {
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
    canDeposit,
    handleApprove,
    handleDeposit,
    approving,
    depositing
  } = useLiquidityGaugePoolDeposit({
    stakingTokenAddress: stakingTokenAddress,
    amount: inputValue,
    poolKey
  })

  const inputLabel = t`Enter Amount You Wish to ${
    modalState === MODAL_STATES.LOCK
      ? 'Lock'
      : modalState === MODAL_STATES.ADD ? 'Add' : 'Unlock'
  }`

  const btnClass = 'w-full p-3 mt-6 font-semibold uppercase sm:min-w-auto sm:w-full'
  const closeModal = (approving || depositing) ? () => {} : onClose

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={closeModal}
      className='h-auto max-w-520'
      overlayProps={{ onClick: closeModal }}
    >
      <div className='w-full overflow-hidden bg-white border-B0C4DB rounded-2xl'>
        <ModalTitle
          showCloseBtn={!approving && !depositing}
          imgSrc={imgSrc}
          modalTitle={modalTitle}
          onClose={onClose}
        />

        <div className='px-8 py-6 pb-8'>
          {([MODAL_STATES.LOCK, MODAL_STATES.ADD].includes(modalState)) && (
            <TokenAmountInput
              labelText={inputLabel}
              tokenBalance={stakingTokenBalance}
              tokenSymbol={stakingTokenSymbol}
              tokenAddress={stakingTokenAddress}
              handleChooseMax={handleChooseMax}
              inputValue={inputValue}
              id='token-amount'
              onChange={handleChange}
              inputId='modal-input'
              disabled={approving || depositing}
            >
              {/* {errorMsg && (
                <p className='flex items-center text-FA5C2F'>{errorMsg}</p>
              )} */}
            </TokenAmountInput>
          )}

          {
            canDeposit
              ? (
                <RegularButton
                  className={btnClass}
                  onClick={handleDeposit}
                  disabled={depositing}
                >
                  <Trans>{depositing ? 'Locking...' : 'Lock'}</Trans>
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
          }

          <div className='flex flex-col gap-4 p-4 mt-6 bg-F3F5F7 rounded-big'>
            <div className='flex flex-row items-center justify-between text-sm'>
              <span>Lockup Period</span>
              <span className='font-semibold'>{explainInterval(lockupPeriod)}</span>
            </div>

            {/* {modalState === MODAL_STATES.ADD && (
              <div className='flex flex-row items-center justify-between text-sm'>
                <span>TVL</span>
                <span className='font-semibold'>{formatCurrency(1200000).short}</span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </ModalRegular>
  )
}
