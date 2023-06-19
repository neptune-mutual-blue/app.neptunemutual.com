import {
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { Label } from '@/common/Label/Label'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { useStakingPoolDeposit } from '@/src/hooks/useStakingPoolDeposit'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { explainInterval } from '@/utils/formatter/interval'
import {
  t,
  Trans
} from '@lingui/macro'

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
    info,
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
          inputId='staked-amount'
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
      <div className='mt-4 xs:mt-8 modal-unlock'>
        <Label className='mb-3' htmlFor='modal-unlock-on'>
          <Trans>Lockup Period</Trans>
        </Label>
        <p id='modal-unlock-on' className='text-lg font-medium text-7398C0'>
          {explainInterval(lockupPeriod)}
        </p>
      </div>

      <div className='xs:mt-4'>
        <DataLoadingIndicator message={loadingMessage} />
        {!canDeposit
          ? (
            <RegularButton
              disabled={!!isError || approving || !inputValue || !!loadingMessage}
              className='w-full p-6 font-semibold uppercase sm:min-w-auto sm:w-full'
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
              disabled={!!isError || depositing || !!loadingMessage}
              className='p-6 font-semibold uppercase min-w-75vw sm:min-w-auto sm:w-full'
              onClick={() => { return handleDeposit(onDepositSuccess) }}
            >
              {depositing ? t`Staking...` : t`Stake`}
            </RegularButton>
            )}
      </div>
    </>
  )
}
