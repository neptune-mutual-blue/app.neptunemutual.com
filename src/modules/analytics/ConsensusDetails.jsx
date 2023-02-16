import { Badge } from '@/common/Badge/Badge'
import * as CardStatusBadgeDefault from '@/common/CardStatusBadge'
import PreviousNext from '@/common/PreviousNext'
import { MULTIPLIER } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { isValidProduct } from '@/src/helpers/cover'
import { useFetchCoverStats } from '@/src/hooks/useFetchCoverStats'
import { convertFromUnits, sumOf, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { useRouter } from 'next/router'
import { StatsCard } from './StatsCard'
const { Badge: CardStatusBadge, identifyStatus, E_CARD_STATUS } = CardStatusBadgeDefault

function ConsensusDetails ({ consensusDetails }) {
  const status = identifyStatus(consensusDetails.incidentReport.status)

  const { NPMTokenSymbol, liquidityTokenDecimals } = useAppConstants()
  const router = useRouter()

  const isDiversified = isValidProduct(consensusDetails.coverInfo?.productKey)
  const coverName = consensusDetails.coverInfo.cover?.infoObj.coverName

  const totalAttested = consensusDetails.incidentReport.totalAttestedStake
  const totalRefuted = consensusDetails.incidentReport.totalRefutedStake
  const isResolved = consensusDetails.incidentReport.resolved

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

  const { info: coverStats, isLoading: coverStatsLoading } = useFetchCoverStats({ coverKey: consensusDetails.incidentReport.coverKey, productKey: consensusDetails.incidentReport.productKey })

  const { activeCommitment, availableLiquidity, totalPoolAmount } = coverStats

  const liquidity = isDiversified ? totalPoolAmount : toBN(availableLiquidity).plus(activeCommitment).toString()
  const protection = activeCommitment
  const protectionLong = coverStatsLoading
    ? '-'
    : formatCurrency(
      convertFromUnits(activeCommitment, liquidityTokenDecimals).toString(),
      router.locale, 'USD', false, true
    ).short
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString()

  const leverage = consensusDetails.coverInfo.cover?.infoObj.leverage
  const efficiency = formatPercent(
    toBN(consensusDetails.coverInfo?.infoObj.capitalEfficiency)
      .dividedBy(MULTIPLIER)
      .toString()
  )

  const protectionBN = toBN(protection)

  let spillover = toBN('0')

  if (isDiversified) {
    spillover = protectionBN.isGreaterThanOrEqualTo(totalPoolAmount) ? protectionBN.minus(totalPoolAmount) : toBN('0')
  }

  return (
    <div>
      <div className='lg:flex justify-between'>
        <div>
          <div className='flex items-center justify-between lg:justify-start'>
            <div className='flex items-center'>
              <img
                src={consensusDetails.imgSrc}
                alt={consensusDetails.name}
                className='w-5 h-5 mr-2'
                data-testid='cover-img'
                // @ts-ignore
                onError={(ev) => (ev.target.src = '/images/covers/empty.svg')}
                />
              <div className='text-sm mr-6'>
                {consensusDetails.name}
              </div>
            </div>
            <PreviousNext />
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

      <div className='grid grid-cols-analytics-stat-cards lg:flex items-start flex-wrap gap-x-6 gap-y-10 my-6'>
        <StatsCard
          titleClass='text-999BAB'
          title='Liquidity' value={formatCurrency(
            convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
            router.locale
          ).short}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Utilization' value={utilization + '%'}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Exposure' value={protectionLong}
        />
        <StatsCard
          titleClass='text-999BAB'
          title='Spillover' value={isDiversified
            ? formatCurrency(
              convertFromUnits(spillover.toString(), liquidityTokenDecimals).toString(),
              router.locale
            ).short
            : 'DEDI'}
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
          title='NPM Staked' value={formatCurrency(
            convertFromUnits(totalStake),
            router.locale,
            NPMTokenSymbol,
            true,
            true
          ).short}
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
      <hr className='h-px border-B0C4DB' />
      <div className='text-xs flex items-center my-7'>
        <span className='mr-2'>
          Resolution:
        </span>
        <Badge className='text-364253 p-1 border-none bg-F3F5F7'>{isResolved ? 'Resolved' : 'Pending'}</Badge>
      </div>
      <div className='grid grid-cols-auto-1fr items-center gap-x-4 gap-y-6 text-sm'>
        <div>{formatCurrency(
          convertFromUnits(totalAttested),
          router.locale,
          NPMTokenSymbol,
          true,
          true
        ).short}
        </div>
        <div>
          <div
            className='h-2 bg-21AD8C rounded-full' style={{
              width: attestedPercentage.toString() + '%'
            }}
          />
        </div>
        <div>{formatCurrency(
          convertFromUnits(totalRefuted),
          router.locale,
          NPMTokenSymbol,
          true,
          true
        ).short}
        </div>
        <div>
          <div
            className='h-2 bg-FA5C2F rounded-full' style={{
              width: refutedPercentage.toString() + '%'
            }}
          />
        </div>
      </div>

    </div>
  )
}

export default ConsensusDetails
