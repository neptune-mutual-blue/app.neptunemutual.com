import { useEffect } from 'react'

import {
  Badge,
  E_CARD_STATUS,
  identifyStatus
} from '@/common/CardStatusBadge'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { ProgressBar } from '@/common/ProgressBar/ProgressBar'
import SheildIcon from '@/icons/SheildIcon'
import DateLib from '@/lib/date/DateLib'
import {
  CoverStatus,
  MULTIPLIER
} from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useSortableStats } from '@/src/context/SortableStatsContext'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'

const lineContentArray = new Array(3).fill(1)
const loading = false
const isLoading = false

export const ActiveReportingCard = ({
  id,
  coverKey,
  productKey = safeFormatBytes32String(''),
  incidentDate,
  coverOrProductData
}) => {
  const { locale } = useLanguageContext()
  const { setStatsByKey } = useSortableStats()
  const { liquidityTokenDecimals } = useAppConstants()

  const isDiversified = isValidProduct(productKey)

  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const capacity = coverOrProductData.capacity
  const utilization = coverOrProductData.utilizationRatio
  const commitment = coverOrProductData.commitment

  const productStatus = CoverStatus[coverOrProductData.productStatus]

  const formattedProtection = formatCurrency(
    convertFromUnits(commitment, liquidityTokenDecimals).toString(),
    locale
  )
  const formattedUtilizationRatio = formatPercent(utilization, locale)

  const imgSrc = getCoverImgSrc({ key: isDiversified ? productKey : coverKey })

  // Used for sorting purpose only
  useEffect(() => {
    setStatsByKey(id, {
      liquidity: capacity,
      utilization,
      text: projectOrProductName,
      isDiversified
    })
  }, [capacity, id, isDiversified, projectOrProductName, setStatsByKey, utilization])

  const status = identifyStatus(productStatus)

  return (
    <OutlinedCard className='p-6 bg-white' type='link'>
      <div className='flex items-start justify-between'>
        <div
          className='p-4 rounded-full w-18 h-18 bg-DEEAF6'
          data-testid='active-report-cover-img'
        >
          <img
            src={imgSrc}
            alt={projectOrProductName}
            className='inline-block max-w-full'
          />
        </div>
        <div data-testid='card-badge'>
          {
            isLoading
              ? <div
                  className='w-40 h-6 rounded-full animate-pulse bg-skeleton'
                  data-testid='card-status-badge'
                />
              : (status !== E_CARD_STATUS.NORMAL && (
                <Badge status={status} className='rounded' />
                ))
          }
        </div>
      </div>
      <h4 className='mt-4 text-lg font-semibold uppercase'>
        {projectOrProductName}
      </h4>
      <div className='flex items-center justify-between'>
        <div
          className='mt-1 text-sm uppercase text-7398C0 lg:mt-2'
          data-testid='cover-fee'
        >
          <Trans>Annual Cover fee:</Trans>{' '}
          {formatPercent(
            toBN(coverOrProductData.floor).dividedBy(MULTIPLIER),
            locale
          )}
          -
          {formatPercent(
            toBN(coverOrProductData.ceiling).dividedBy(MULTIPLIER),
            locale
          )}
        </div>
        {isDiversified && (
          <InfoTooltip
            infoComponent={
              <p>
                <Trans>
                  Diversified pool with {coverOrProductData.leverage}x
                  leverage factor and{' '}
                  {formatPercent(
                    toBN(coverOrProductData.capitalEfficiency)
                      .dividedBy(MULTIPLIER)
                      .toString()
                  )}{' '}
                  capital efficiency
                </Trans>
              </p>
            }
          >
            <div className='rounded bg-EEEEEE text-black text-xs px-1 border-9B9B9B border-0.5'>
              <p className='opacity-60'>
                D{coverOrProductData.leverage}x
                {formatPercent(
                  toBN(coverOrProductData.capitalEfficiency)
                    .dividedBy(MULTIPLIER)
                    .toString(),
                  locale,
                  false
                )}
              </p>
            </div>
          </InfoTooltip>
        )}
      </div>

      {/* Divider */}
      <Divider />

      {loading && lineContentArray.map((_, i) => {
        return (
          <div
            key={i}
            className='h-3 mt-3 rounded-full bg-skeleton'
            data-testid='card-line-content'
          />
        )
      })}

      {/* Stats */}
      <div className={classNames('justify-between px-1 text-xs lg:text-sm', loading ? 'hidden' : 'flex')}>
        <span className='text-xs uppercase lg:text-sm'>
          <Trans>Utilization ratio</Trans>
        </span>
        <span
          className='text-xs font-semibold text-right lg:text-sm '
          data-testid='util-ratio'
        >
          {formatPercent(utilization, locale)}
        </span>
      </div>

      <InfoTooltip
        infoComponent={
          <div>
            <p>
              <b>
                <Trans>Utilization ratio:</Trans> {formattedUtilizationRatio}
              </b>
            </p>
            <p>
              <Trans>Protection</Trans>:  {formattedProtection.long}
            </p>
          </div>
        }
      >
        <div className={classNames('mt-2 mb-4', loading ? 'hidden' : 'block')}>
          <ProgressBar value={utilization} />
        </div>
      </InfoTooltip>

      <div className={classNames('justify-between px-1 text-01052D opacity-40 text-xs lg:text-sm', loading ? 'hidden' : 'flex')}>
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Protection</Trans>: {formattedProtection.long}
            </div>
          }
        >
          <div
            className='flex flex-1'
            title={formattedProtection.long}
            data-testid='protection'
          >
            <span role='tooltip' aria-label='Protection'>
              <SheildIcon className='w-4 h-4 text-01052D' />
            </span>
            <p>
              {formattedProtection.short}
            </p>
          </div>
        </InfoTooltip>
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Reported On:</Trans>:{' '}
              {DateLib.toLongDateFormat(incidentDate, locale)}
            </div>
          }
        >
          <div
            data-testid='incident-date'
            className='flex-1 text-right'
            title={DateLib.toLongDateFormat(incidentDate, locale)}
          >
            {fromNow(incidentDate)}
          </div>
        </InfoTooltip>
      </div>
    </OutlinedCard>
  )
}
