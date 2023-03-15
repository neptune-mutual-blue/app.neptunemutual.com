
import { useRouter } from 'next/router'

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
import { MULTIPLIER } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useFetchCoverStats } from '@/src/hooks/useFetchCoverStats'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Trans } from '@lingui/macro'
import { CoverAvatar } from '@/common/CoverAvatar'

const lineContentArray = new Array(3).fill(1)

export const ProductCard = ({
  coverKey,
  productKey,
  productData,
  progressFgColor = undefined,
  progressBgColor = undefined,
  className = ''
}) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const { info: coverStats, isLoading } = useFetchCoverStats({
    coverKey: coverKey,
    productKey: productKey
  })

  const { productStatus } = coverStats

  const capacity = productData.capacity
  const utilization = productData.utilizationRatio

  const protectionLong = formatCurrency(
    convertFromUnits(productData.commitment, liquidityTokenDecimals).toString(),
    router.locale
  ).long

  const liquidityLong = formatCurrency(
    convertFromUnits(capacity, liquidityTokenDecimals).toString(),
    router.locale
  ).long

  const status = identifyStatus(productStatus)

  return (
    <OutlinedCard className={classNames('p-6 bg-white', className)} type='link'>
      <div className='flex items-start justify-between min-h-72'>
        <CoverAvatar imgs={[{
          src: getCoverImgSrc({ key: productData.productKey }),
          alt: productData.productInfoDetails?.productName
        }]}
        />
        <div>
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
      <p
        className='mt-4 font-semibold text-black uppercase text-h4'
        data-testid='project-name'
      >
        {productData.productInfoDetails?.productName}
      </p>
      <div className='flex items-center justify-between'>
        <div
          className='mt-1 uppercase text-h7 opacity-40 lg:text-sm text-01052D lg:mt-2'
          data-testid='cover-fee'
        >
          <Trans>Annual Cover fee:</Trans>{' '}
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
        {productData.coverInfoDetails?.leverageFactor && (
          <InfoTooltip
            infoComponent={
              <p>
                <Trans>
                  Diversified pool with {productData.coverInfoDetails.leverageFactor}x
                  leverage factor and{' '}
                  {formatPercent(
                    toBN(productData.capitalEfficiency)
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
                D{productData.coverInfoDetails.leverageFactor}x
                {formatPercent(
                  toBN(productData.capitalEfficiency)
                    .dividedBy(MULTIPLIER)
                    .toString(),
                  router.locale,
                  false
                )}
              </p>
            </div>
          </InfoTooltip>
        )}
      </div>

      {/* Divider */}
      <Divider className='mb-4 lg:mb-8' />

      {/* Stats */}
      {isLoading && lineContentArray.map((_, i) => (
        <div
          key={i}
          className='h-3 mt-3 rounded-full bg-skeleton'
          data-testid='card-line-content'
        />
      ))}

      <div className={classNames('justify-between px-1 text-h7 lg:text-sm', isLoading ? 'hidden' : 'flex')}>
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
              <strong>
                <Trans>
                  Utilization ratio: {formatPercent(utilization, router.locale)}
                </Trans>
              </strong>
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
        <div className={classNames('mt-2 mb-4', isLoading ? 'hidden' : 'block')}>
          <ProgressBar
            value={utilization}
            bgClass={progressBgColor}
            fgClass={progressFgColor}
          />
        </div>
      </InfoTooltip>

      <div
        className={classNames('justify-between px-1 text-01052D opacity-40 text-h7 lg:text-sm', isLoading ? 'hidden' : 'flex')}
      >
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
                    productData.commitment,
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
                convertFromUnits(capacity, liquidityTokenDecimals).toString(),
                router.locale
              ).short
            }
          </div>
        </InfoTooltip>
      </div>
    </OutlinedCard>
  )
}
