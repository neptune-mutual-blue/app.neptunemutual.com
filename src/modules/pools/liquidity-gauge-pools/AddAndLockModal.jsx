import { RegularButton } from '@/common/Button/RegularButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import {
  ModalTitle
} from '@/modules/pools/liquidity-gauge-pools/ReceiveAndUnlockModal'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import {
  useLiquidityGaugePoolDeposit
} from '@/src/hooks/useLiquidityGaugePoolDeposit'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const AddAndLockModal = ({
  modalTitle,
  isOpen,
  onClose,
  imgSrc,
  lockupPeriodInBlocks,
  poolAddress,
  stakingTokenAddress,
  stakingTokenDecimals,
  stakingTokenSymbol,
  inputValue,
  setInputValue,
  updateStakedAndReward,
  poolStaked
}) => {
  const handleChange = (val) => {
    if (typeof val === 'string') {
      setInputValue(val)
    }
  }

  const { balance: stakingTokenBalance } = useERC20Balance(stakingTokenAddress)

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(stakingTokenBalance, stakingTokenDecimals).toString())
  }

  const {
    canApprove,
    canDeposit,
    handleApprove,
    handleDeposit,
    approving,
    depositing,
    loadingAllowance,
    error
  } = useLiquidityGaugePoolDeposit({
    amount: inputValue,
    stakingTokenAddress,
    stakingTokenDecimals,
    stakingTokenSymbol,
    poolAddress
  })

  const isPoolStaked = toBN(poolStaked).isGreaterThan(0)

  const { i18n } = useLingui()

  const inputLabel = isPoolStaked ? t(i18n)`Enter Amount You Wish to Add` : t(i18n)`Enter Amount You Wish to Lock`

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
            {(error) && (
              <p className='flex items-center text-FA5C2F'>{error}</p>
            )}
          </TokenAmountInput>

          {
            canDeposit
              ? (
                <RegularButton
                  className={btnClass}
                  onClick={() => {
                    return handleDeposit(() => {
                      updateStakedAndReward()
                      setInputValue('')
                    })
                  }}
                  disabled={depositing || loadingAllowance}
                >
                  {depositing ? <Trans>Locking...</Trans> : <Trans>Lock</Trans>}
                </RegularButton>
                )
              : (
                <RegularButton
                  className={btnClass}
                  disabled={!canApprove || approving || loadingAllowance}
                  onClick={handleApprove}
                >
                  {approving ? <Trans>Approving...</Trans> : <Trans>Approve</Trans>}
                </RegularButton>
                )
          }

          <div className='flex flex-col gap-4 p-4 mt-6 bg-F3F5F7 rounded-big'>
            <div className='flex flex-row items-center justify-between text-sm'>
              <span>Lockup Period</span>
              <span className='font-semibold'>{lockupPeriodInBlocks} Blocks</span>
            </div>

            {/* {isPoolStaked && (
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
