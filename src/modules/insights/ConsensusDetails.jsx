import { Badge } from '@/common/Badge/Badge'
import * as CardStatusBadgeDefault from '@/common/CardStatusBadge'
import PreviousNext from '@/common/PreviousNext'
import { MULTIPLIER } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { isValidProduct } from '@/src/helpers/cover'
import { convertFromUnits, sumOf, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { useRouter } from 'next/router'
import { StatsCard } from './StatsCard'
const { Badge: CardStatusBadge, identifyStatus, E_CARD_STATUS } = CardStatusBadgeDefault

function ConsensusDetails ({ consensusIndex, setConsensusIndex, data }) {
  const row = data.incidentReports[consensusIndex]
  const status = identifyStatus(row.status)

  const { NPMTokenSymbol, liquidityTokenDecimals } = useAppConstants()
  const router = useRouter()

  const isDiversified = isValidProduct(row.coverInfo?.productKey)
  const coverName = row.coverInfo.cover?.infoObj.coverName

  const totalAttested = row.totalAttestedStake
  const totalRefuted = row.totalRefutedStake
  const isResolved = row.resolved

  const totalStake = sumOf(totalAttested, totalRefuted)

  const attestedPercentage = toBN(totalAttested)
    .dividedBy(
      totalStake
    ).multipliedBy(100)
    .decimalPlaces(2)

  const refutedPercentage = toBN(totalRefuted)
    .dividedBy(
      totalStake
    ).multipliedBy(100)
    .decimalPlaces(2)

  const coverStats = row.coverStats
  const coverStatsLoading = row.coverStatsLoading

  const { activeCommitment, availableLiquidity, totalPoolAmount } = coverStats

  const liquidity = isDiversified ? totalPoolAmount : toBN(availableLiquidity).plus(activeCommitment).toString()

  const protection = activeCommitment
  const protectionLong = coverStatsLoading
    ? { short: '-', long: '-' }
    : formatCurrency(
      convertFromUnits(activeCommitment, liquidityTokenDecimals).toString(),
      router.locale, 'USD', false, true
    )
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString()

  const leverage = row.coverInfo.cover?.infoObj.leverage
  const efficiency = isDiversified
    ? formatPercent(
      toBN(row.coverInfo?.infoObj.capitalEfficiency)
        .dividedBy(MULTIPLIER)
        .toString()
    )
    : formatPercent(1, router.locale)

  const protectionBN = toBN(protection)

  let spillover = toBN('0')

  let spillOverText

  if (isDiversified) {
    spillover = protectionBN.isGreaterThanOrEqualTo(totalPoolAmount) ? protectionBN.minus(totalPoolAmount) : toBN('0')
    spillOverText = formatCurrency(
      convertFromUnits(spillover.toString(), liquidityTokenDecimals).toString(),
      router.locale
    )
  }

  const refuted = formatCurrency(
    convertFromUnits(totalRefuted),
    router.locale,
    NPMTokenSymbol,
    true,
    true
  )

  const attested = formatCurrency(
    convertFromUnits(totalAttested),
    router.locale,
    NPMTokenSymbol,
    true,
    true
  )

  const totalStakeText = formatCurrency(
    convertFromUnits(totalStake),
    router.locale,
    NPMTokenSymbol,
    true,
    true
  )

  const liquidityText = formatCurrency(
    convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
    router.locale,
    'USD',
    false,
    true
  )

  return (
    <div>
      <div className='justify-between lg:flex'>
        <div>
          <div className='flex items-center justify-between lg:justify-start'>
            <div className='flex items-center'>
              <img
                src={row.imgSrc}
                alt={row.name}
                className='w-5 h-5 mr-2'
                data-testid='cover-img'
                // @ts-ignore
                onError={
                  (ev) => (ev.target.src = '/images/covers/empty.svg')
                }
              />
              <div className='mr-6 text-sm'>
                {row.name}
              </div>
            </div>
            <PreviousNext
              hasNext={consensusIndex < (data.incidentReports.length - 1)} hasPrevious={consensusIndex > 0} onPrevious={() => {
                setConsensusIndex(consensusIndex - 1)
              }}
              onNext={() => {
                setConsensusIndex(consensusIndex + 1)
              }}
            />
          </div>
          {isDiversified && (
            <div className='text-xs text-21AD8C mt-2.5'>{coverName}</div>
          )}
        </div>

        {status !== E_CARD_STATUS.NORMAL && (
          <CardStatusBadge
            className='mt-3 lg:mt-0 rounded-1 py-0 leading-4 border-0 tracking-normal inline-block !text-xs'
            status={status}
          />
        )}

      </div>

      <div className='grid flex-wrap items-start my-6 grid-cols-analytics-stat-cards lg:flex gap-x-6 gap-y-10 lg:my-10'>
        <StatsCard
          titleClass='text-999BAB'
          title='Liquidity' value={liquidityText.short}
          tooltip={liquidityText.long}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Utilization' value={formatPercent(utilization, router.locale)}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Exposure' value={protectionLong.short}
          tooltip={protectionLong.long}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Spillover' value={isDiversified
            ? spillOverText.short
            : 'DEDI'}
          tooltip={isDiversified ? spillOverText.long : 'DEDI'}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Leverage' value={(leverage || '1') + 'x'}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Efficiency' value={efficiency}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='NPM Staked' value={totalStakeText.short.split(' ')[0]}
          tooltip={totalStakeText.long}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Guaranteed' value={isDiversified ? 'No' : 'Yes'}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Mode' value={isDiversified ? 'FC-FS' : '-'}
        />
      </div>
      <hr className='border-t-0.5 border-t-B0C4DB' />
      <div className='flex items-center my-6 text-xs lg:my-10'>
        <span className='mr-2'>
          Resolution:
        </span>
        <Badge className='px-1 border-none text-364253 bg-F3F5F7'>{isResolved ? 'Resolved' : 'Pending'}</Badge>
      </div>
      <div className='grid items-center text-sm grid-cols-auto-1fr gap-x-4 gap-y-6'>
        <div title={attested.long}>{attested.short}</div>
        <div>
          <div
            className='h-2 rounded-full bg-21AD8C' style={{
              width: attestedPercentage.toString() + '%'
            }}
          />
        </div>
        <div title={refuted.long}>{refuted.short}</div>
        <div>
          <div
            className='h-2 rounded-full bg-FA5C2F' style={{
              width: refutedPercentage.toString() + '%'
            }}
          />
        </div>
      </div>

    </div>
  )
}

export default ConsensusDetails
