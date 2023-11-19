import {
  useEffect,
  useState
} from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { Label } from '@/common/Label/Label'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { TokenAmountSpan } from '@/common/TokenAmountSpan'
import { useBlockHeight } from '@/src/hooks/useBlockHeight'
import { useStakingPoolWithdraw } from '@/src/hooks/useStakingPoolWithdraw'
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isValidNumber
} from '@/utils/bn'
import {
  t,
  Trans
} from '@lingui/macro'

export const UnStakeForm = ({
  info,
  stakingTokenSymbol,
  stakedAmount,
  refetchInfo,
  poolKey,
  setModalDisabled,
  onUnstakeSuccess = () => {}
}) => {
  const blockHeight = useBlockHeight()

  const [inputValue, setInputValue] = useState('')

  const { withdrawing, handleWithdraw } = useStakingPoolWithdraw({
    value: inputValue,
    tokenSymbol: stakingTokenSymbol,
    poolKey,
    refetchInfo
  })

  useEffect(() => {
    return () => {
      setInputValue('')
    }
  }, [])

  useEffect(() => {
    setModalDisabled((val) => { return { ...val, w: withdrawing } })
  }, [setModalDisabled, withdrawing])

  const canWithdraw = isGreater(blockHeight, info.canWithdrawFromBlockHeight)
  const stakingTokenAddress = info.stakingToken
  const stakingDecimals = info.stakingTokenDecimals
  const isError =
    inputValue &&
    (!isValidNumber(inputValue) ||
      isGreater(convertToUnits(inputValue || '0'), stakedAmount))

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(stakedAmount, stakingDecimals).toString())
  }

  const handleChange = (val) => {
    if (typeof val === 'string') {
      setInputValue(val)
    }
  }

  return (
    <div className='px-12 mt-6'>
      <TokenAmountInput
        inputId='withdraw-amount'
        inputValue={inputValue}
        handleChooseMax={handleChooseMax}
        labelText={t`Amount you wish to withdraw`}
        onChange={handleChange}
        tokenSymbol={stakingTokenSymbol}
        tokenAddress={stakingTokenAddress}
        disabled={withdrawing}
      >
        <p className=''>
          <Trans>Your Stake</Trans>:{' '}
          <TokenAmountSpan
            amountInUnits={stakedAmount}
            symbol={stakingTokenSymbol}
            decimals={stakingDecimals}
          />
        </p>
        {!canWithdraw && (
          <p className='flex items-center text-FA5C2F'>
            <Trans>Could not withdraw during lockup period</Trans>
          </p>
        )}
      </TokenAmountInput>

      <div className='mt-4 xs:mt-8 modal-unlock'>
        <Label className='mb-3' htmlFor='modal-unlock-on'>
          <Trans>Unlocks At Block</Trans>
        </Label>
        <p
          id='modal-unlock-on'
          className='text-lg font-medium text-7398C0'
        >
          {info.canWithdrawFromBlockHeight}
        </p>
      </div>

      <RegularButton
        disabled={isError || withdrawing || !canWithdraw}
        className='w-full p-6 mt-8 font-semibold uppercase'
        onClick={() => {
          handleWithdraw(() => {
            onUnstakeSuccess()
            refetchInfo()
          })
        }}
      >
        {withdrawing ? t`Withdrawing...` : t`Unstake`}
      </RegularButton>
    </div>
  )
}
