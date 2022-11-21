import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

import { Divider } from '@/common/Divider/Divider'
import { ProgressBar } from '@/common/ProgressBar/ProgressBar'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { formatCurrency } from '@/utils/formatter/currency'
import { convertFromUnits, toBN } from '@/utils/bn'
import { formatPercent } from '@/utils/formatter/percent'
import { MULTIPLIER } from '@/src/config/constants'
import { Trans } from '@lingui/macro'
import { useFetchCoverStats } from '@/src/hooks/useFetchCoverStats'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import { useAppConstants } from '@/src/context/AppConstants'
import { utils } from '@neptunemutual/sdk'
import { Badge, E_CARD_STATUS, identifyStatus } from '@/common/CardStatusBadge'
import SheildIcon from '@/icons/SheildIcon'
import { CoverAvatar } from '@/common/CoverAvatar'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { classNames } from '@/utils/classnames'

export const CoverCard = ({
  coverKey,
  coverInfo,
  progressFgColor = undefined,
  progressBgColor = undefined,
  className = ''
}) => {
  const router = useRouter()
  const { setStatsByKey } = useSortableStats()
  const { liquidityTokenDecimals } = useAppConstants()

  const productKey = utils.keyUtil.toBytes32('')
  const { info: coverStats } = useFetchCoverStats({
    coverKey: coverKey,
    productKey: productKey
  })

  const isDiversified = coverInfo?.supportsProducts
  const { activeCommitment, productStatus, availableLiquidity } = coverStats

  const liquidity = isDiversified
    ? coverStats.totalPoolAmount // for diversified cover -> liquidity does not consider capital efficiency
    : toBN(availableLiquidity).plus(activeCommitment).toString()
  const protection = activeCommitment
  const utilization = toBN(liquidity).isEqualTo(0)
    ? '0'
    : toBN(protection).dividedBy(liquidity).decimalPlaces(2).toString()

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(coverKey, {
      liquidity,
      utilization,
      infoObj: coverInfo?.infoObj
    })
  }, [coverInfo?.infoObj, coverKey, liquidity, setStatsByKey, utilization])

  const protectionLong = formatCurrency(
    convertFromUnits(activeCommitment, liquidityTokenDecimals).toString(),
    router.locale
  ).long

  const liquidityLong = formatCurrency(
    convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
    router.locale
  ).long

  const status = isDiversified
    ? E_CARD_STATUS.DIVERSIFIED
    : identifyStatus(productStatus)

  return (
    <OutlinedCard className={classNames('p-6 bg-white', className)} type='link'>
      <div className='flex items-start min-h-72'>
        <CoverAvatar coverInfo={coverInfo} isDiversified={isDiversified} />
        <InfoTooltip
          disabled={coverInfo.products?.length === 0}
          infoComponent={
            <div>
              <p>
                Leverage Ration: <b>{coverInfo.infoObj?.leverage}x</b>
              </p>
              <p>Determines available capital to underwrite</p>
            </div>
          }
        >
          <div>
            {status !== E_CARD_STATUS.NORMAL && (
              <Badge status={status} className='rounded' />
            )}
          </div>
        </InfoTooltip>
      </div>
      <p
        className='mt-4 font-semibold text-black uppercase text-h4 font-sora'
        data-testid='project-name'
      >
        {coverInfo.infoObj.coverName || coverInfo.infoObj.projectName}
      </p>
      <div
        className='mt-1 uppercase text-h7 opacity-40 lg:text-sm text-01052D lg:mt-2'
        data-testid='cover-fee'
      >
        <Trans>Cover fee:</Trans>{' '}
        {formatPercent(
          toBN(coverStats.policyRateFloor).dividedBy(MULTIPLIER),
          router.locale
        )}
        -
        {formatPercent(
          toBN(coverStats.policyRateCeiling).dividedBy(MULTIPLIER),
          router.locale
        )}
      </div>

      {/* Divider */}
      <Divider className='mb-4 lg:mb-8' />

      {/* Stats */}
      <div className='flex justify-between px-1 text-h7 lg:text-sm'>
        <span className='uppercase text-h7 lg:text-sm'>
          <Trans>Utilization ratio</Trans>
        </span>
        <span
          className='font-semibold text-right text-h7 lg:text-sm '
          data-testid='util-ratio'
        >
          {formatPercent(utilization, router.locale)}
        </span>
      </div>

      <InfoTooltip
        infoComponent={
          <div>
            <p>
              <b>
                <Trans>Utilization ratio:</Trans>{' '}
                {formatPercent(utilization, router.locale)}
              </b>
            </p>
            <p>
              <Trans>Protection</Trans>: {protectionLong}
            </p>
            <p>
              <Trans>Liquidity</Trans>: {liquidityLong}
            </p>
          </div>
        }
      >
        <div className='mt-2 mb-4'>
          <ProgressBar
            value={utilization}
            bgClass={progressBgColor}
            fgClass={progressFgColor}
          />
        </div>
      </InfoTooltip>

      <div className='flex justify-between px-1 text-01052D opacity-40 text-h7 lg:text-sm'>
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Protection</Trans>: {protectionLong}
            </div>
          }
        >
          <div
            className='flex flex-1'
            title={protectionLong}
            data-testid='protection'
          >
            <span role='tooltip' aria-label='Protection'>
              <SheildIcon className='w-4 h-4 text-01052D' />
            </span>
            <p>
              {
                formatCurrency(
                  convertFromUnits(
                    activeCommitment,
                    liquidityTokenDecimals
                  ).toString(),
                  router.locale
                ).short
              }
            </p>
          </div>
        </InfoTooltip>
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Liquidity</Trans>: {liquidityLong}
            </div>
          }
        >
          <div
            className='flex-1 text-right'
            title={liquidityLong}
            data-testid='liquidity'
          >
            {
              formatCurrency(
                convertFromUnits(liquidity, liquidityTokenDecimals).toString(),
                router.locale
              ).short
            }
          </div>
        </InfoTooltip>
      </div>
    </OutlinedCard>
  )
}
