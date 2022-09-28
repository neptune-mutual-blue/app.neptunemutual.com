import { RegularButton } from '@/common/Button/RegularButton'
import { Label } from '@/common/Label/Label'
import { useState, useEffect } from 'react'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { convertFromUnits } from '@/utils/bn'
import { useStakingPoolDeposit } from '@/src/hooks/useStakingPoolDeposit'
import { explainInterval } from '@/utils/formatter/interval'
import { formatCurrency } from '@/utils/formatter/currency'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'

export const StakeForm = ({
  info,
  refetchInfo,
  poolKey,
  onClose,
  stakingTokenSymbol,
  lockupPeriod,
  setModalDisabled
}) => {
  const tokenAddress = info.stakingToken
  const [inputValue, setInputValue] = useState('')

  const {
    balance,
    loadingBalance,
    maxStakableAmount,
    isError,
    errorMsg,
    canDeposit,
    approving,
    loadingAllowance,
    depositing,
    handleDeposit,
    handleApprove
  } = useStakingPoolDeposit({
    refetchInfo,
    value: inputValue,
    tokenAddress,
    tokenSymbol: stakingTokenSymbol,
    poolKey,
    maximumStake: info.maximumStake
  })
  const router = useRouter()

  useEffect(() => {
    setModalDisabled(approving || depositing)
  }, [approving, depositing, setModalDisabled])

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(maxStakableAmount).toString())
  }

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setInputValue(val)
    }
  }

  const onDepositSuccess = () => {
    onClose()
  }

  let loadingMessage = ''
  if (loadingBalance) {
    loadingMessage = t`Fetching balance...`
  } else if (loadingAllowance) {
    loadingMessage = t`Fetching allowance...`
  }

  return (
    <>
      <div className='mt-6'>
        <TokenAmountInput
          labelText={t`Amount you wish to stake`}
          tokenBalance={balance}
          tokenSymbol={stakingTokenSymbol}
          tokenAddress={tokenAddress}
          handleChooseMax={handleChooseMax}
          inputValue={inputValue}
          id='staked-amount'
          disabled={approving || depositing}
          onChange={handleChange}
        >
          <p>
            <Trans>Maximum Limit:</Trans>{' '}
            <span
              title={`${
                formatCurrency(
                  convertFromUnits(info.maximumStake).toString(),
                  router.locale,
                  stakingTokenSymbol,
                  true
                ).long
              }`}
            >
              {
                formatCurrency(
                  convertFromUnits(info.maximumStake).toString(),
                  router.locale,
                  stakingTokenSymbol,
                  true
                ).short
              }
            </span>
          </p>
          {errorMsg && (
            <p className='flex items-center text-FA5C2F'>{errorMsg}</p>
          )}
        </TokenAmountInput>
      </div>
      <div className='mt-8 modal-unlock'>
        <Label className='mb-3' htmlFor='modal-unlock-on'>
          <Trans>Lockup Period</Trans>
        </Label>
        <p id='modal-unlock-on' className='font-medium text-7398C0 text-h4'>
          {explainInterval(lockupPeriod)}
        </p>
      </div>

      <div className='mt-4'>
        <DataLoadingIndicator message={loadingMessage} />
        {!canDeposit
          ? (
            <RegularButton
              disabled={isError || approving || !inputValue || loadingMessage}
              className='w-full p-6 font-semibold uppercase text-h6'
              onClick={handleApprove}
            >
              {approving
                ? (
                    t`Approving...`
                  )
                : (
                  <>
                    <Trans>Approve</Trans> {stakingTokenSymbol}
                  </>
                  )}
            </RegularButton>
            )
          : (
            <RegularButton
              disabled={isError || depositing || loadingMessage}
              className='w-full p-6 font-semibold uppercase text-h6'
              onClick={() => handleDeposit(onDepositSuccess)}
            >
              {depositing ? t`Staking...` : t`Stake`}
            </RegularButton>
            )}
      </div>
    </>
  )
}
