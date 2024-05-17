import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

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
  lockupPeriodInBlocks,
  stakingTokenSymbol,
  stakingTokenDecimals,
  rewardTokenSymbol,
  rewardTokenDecimals,
  lockedByMe,
  rewardAmount,
  tvl,
  liquidityTokenDecimals
}) {
  const { locale } = useLanguageContext()

  const formattedBalance = formatCurrency(
    convertFromUnits(lockedByMe, stakingTokenDecimals),
    locale,
    stakingTokenSymbol,
    true
  )

  const formattedReward = formatCurrency(
    convertFromUnits(rewardAmount, rewardTokenDecimals),
    locale,
    rewardTokenSymbol,
    true
  )

  const formattedTvl = formatCurrency(
    convertFromUnits(tvl, liquidityTokenDecimals),
    locale
  )

  const hasLockedAmount = toBN(lockedByMe).isGreaterThan(0) || toBN(rewardAmount).isGreaterThan(0)

  const { i18n } = useLingui()

  const stats = [
    hasLockedAmount && {
      label: t(i18n)`Your Locked Balance`,
      value: formattedBalance.short,
      tooltip: formattedBalance.long
    },
    hasLockedAmount && {
      label: t(i18n)`Emission Received`,
      value: formattedReward.short,
      tooltip: formattedReward.long
    },
    {
      label: t(i18n)`Lockup Period`,
      value: t(i18n)`${lockupPeriodInBlocks} Blocks`
    },
    {
      label: t(i18n)`TVL`,
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
        <div className='flex flex-col w-full gap-4 p-4 mt-6 text-sm bg-F3F5F7 rounded-xl md:max-w-420 md:mt-0'>
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
