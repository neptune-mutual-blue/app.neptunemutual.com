import { useRouter } from 'next/router'

import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'

const StatBeforeLocked = ({
  label,
  value,
  tooltip = undefined
}) => {
  return (
    <div className='text-sm text-999BAB'>
      {label}:{' '}
      <span className='font-semibold text-01052D' title={tooltip}>
        {value}
      </span>
    </div>
  )
}

const StatAfterLocked = ({
  label,
  value,
  tooltip = undefined
}) => {
  return (
    <div className='flex flex-row justify-between'>
      <span>{label}</span>
      <span className='font-semibold' title={tooltip}>{value}</span>
    </div>
  )
}

export function LiquidityGaugePoolStats ({
  lockupPeriodInBlocks, stakingTokenSymbol, stakingTokenDecimals, rewardTokenSymbol, rewardTokenDecimals, lockedByMe, rewardAmount, tvl
}) {
  const router = useRouter()

  const formattedBalance = formatCurrency(
    convertFromUnits(lockedByMe, stakingTokenDecimals),
    router.locale,
    stakingTokenSymbol,
    true
  )

  const formattedReward = formatCurrency(
    convertFromUnits(rewardAmount, rewardTokenDecimals),
    router.locale,
    rewardTokenSymbol,
    true
  )

  const formattedTvl = formatCurrency(tvl)

  const hasLockedAmount = toBN(lockedByMe).isGreaterThan(0)

  const stats = [
    hasLockedAmount && {
      label: t`Your Locked Balance`,
      value: formattedBalance.short,
      tooltip: formattedBalance.long
    },
    hasLockedAmount && {
      label: t`Emission Received`,
      value: formattedReward.short,
      tooltip: formattedReward.long
    },
    {
      label: t`Lockup Period`,
      value: t`${lockupPeriodInBlocks} Blocks`
    },
    {
      label: t`TVL`,
      value: formattedTvl.short,
      tooltip: formattedTvl.long
    }
  ].filter(Boolean)

  return (
    <>
      {!hasLockedAmount && (
        <div className='flex flex-col gap-1'>
          {stats.map(stat => {
            return (
              <StatBeforeLocked
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            )
          })}
        </div>
      )}

      {hasLockedAmount && (
        <div className='flex flex-col gap-4 p-4 bg-F3F5F7 rounded-xl w-full md:max-w-420 text-sm mt-6 md:mt-8.5'>
          {(stats.map(stat => {
            return (
              <StatAfterLocked
                key={stat.label}
                label={stat.label}
                value={stat.value}
              />
            )
          }))}
        </div>)}

      {/* <div className='flex flex-row items-center gap-1'>
        <div className='text-sm text-999BAB'>Reward Tokens:</div>
        <InfoTooltip infoComponent={`${tokenName} Token`} className='text-xs px-2 py-0.75 bg-opacity-100'>
          <button type='button' className='cursor-default'><img src={tokenIcon} alt='npm_icon' className='w-6' /></button>
        </InfoTooltip>
      </div> */}
    </>
  )
}
