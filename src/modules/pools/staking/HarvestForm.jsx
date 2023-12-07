import { useEffect } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { TokenAmountSpan } from '@/common/TokenAmountSpan'
import AddCircleIcon from '@/icons/AddCircleIcon'
import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import {
  useStakingPoolWithdrawRewards
} from '@/src/hooks/useStakingPoolWithdraw'
import { convertFromUnits } from '@/utils/bn'
import { Trans } from '@lingui/macro'

export const HarvestForm = ({
  info,
  stakingTokenSymbol,
  stakedAmount,
  rewardAmount,
  rewardTokenAddress,
  rewardTokenSymbol,
  poolKey,
  refetchInfo,
  setModalDisabled,
  onHarvestSuccess = () => {}
}) => {
  const rewardTokenDecimals = info.rewardTokenDecimals
  const stakingTokenDecimals = info.stakingTokenDecimals

  const { handleWithdrawRewards, withdrawingRewards } =
    useStakingPoolWithdrawRewards({
      poolKey,
      refetchInfo,
      rewardTokenSymbol,
      rewardAmount: convertFromUnits(rewardAmount, rewardTokenDecimals).toString()
    })
  const { register } = useRegisterToken()

  useEffect(() => {
    setModalDisabled((val) => { return { ...val, wr: withdrawingRewards } })
  }, [setModalDisabled, withdrawingRewards])

  return (
    <div className='px-12'>
      <div className='flex justify-between px-1 mt-6 mb-3 font-semibold text-md'>
        <span className='capitalize'>
          <Trans>Your Stake</Trans>
        </span>
        <span className='text-right'>
          <Trans>You Earned</Trans>
        </span>
      </div>
      <div className='flex justify-between px-1 text-lg'>
        <TokenAmountSpan
          amountInUnits={stakedAmount}
          symbol={stakingTokenSymbol}
          decimals={stakingTokenDecimals}
          className='uppercase text-7398C0'
        />
        <span className='inline-flex items-center text-right uppercase text-7398C0'>
          <TokenAmountSpan
            amountInUnits={rewardAmount}
            symbol={rewardTokenSymbol}
            decimals={rewardTokenDecimals}
          />
          <button
            className='ml-1'
            onClick={() => { return register(rewardTokenAddress, rewardTokenSymbol) }}
            title='Add to Metamask'
          >
            <span className='sr-only'>Add to Metamask</span>
            <AddCircleIcon width={16} fill='currentColor' />
          </button>
        </span>
      </div>

      <RegularButton
        disabled={withdrawingRewards}
        className='w-full p-6 mt-8 font-semibold uppercase'
        onClick={() => {
          handleWithdrawRewards(() => {
            onHarvestSuccess()
            refetchInfo()
          })
        }}
      >
        {withdrawingRewards ? <Trans>Collecting...</Trans> : <Trans>Collect</Trans>}
      </RegularButton>
    </div>
  )
}
