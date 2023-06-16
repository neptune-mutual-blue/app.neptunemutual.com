import { useRouter } from 'next/router'

import {
  Badge,
  E_CARD_STATUS,
  identifyStatus
} from '@/common/CardStatusBadge'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { CoverAvatar } from '@/common/CoverAvatar'
import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { ProgressBar } from '@/common/ProgressBar/ProgressBar'
import SheildIcon from '@/icons/SheildIcon'
import {
  CoverStatus,
  MULTIPLIER
} from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { getCoverImgSrc } from '@/src/helpers/cover'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Trans } from '@lingui/macro'

const lineContentArray = new Array(3).fill(1)
const loading = false
const isLoading = false

export const ProductCard = ({
  productKey,
  productData,
  progressFgColor = undefined,
  progressBgColor = undefined,
  className = ''
}) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const productStatus = CoverStatus[productData.productStatus]

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
          src: getCoverImgSrc({ key: productKey }),
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
        className='mt-4 text-lg font-semibold text-black uppercase'
        data-testid='project-name'
      >
        {productData.productInfoDetails?.productName}
      </p>
      <div className='flex items-center justify-between'>
        <div
          className='mt-1 text-xs uppercase opacity-40 lg:text-sm text-01052D lg:mt-2'
          data-testid='cover-fee'
        >
          <Trans>Annual Cover fee:</Trans>{' '}
          {formatPercent(
            toBN(productData.floor).dividedBy(MULTIPLIER),
            router.locale
          )}
          -
          {formatPercent(
            toBN(productData.ceiling).dividedBy(MULTIPLIER),
            router.locale
          )}
        </div>
        {productData.leverage && (
          <InfoTooltip
            infoComponent={
              <p>
                <Trans>
                  Diversified pool with {productData.leverage}x
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
                D{productData.leverage}x
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
      {loading && lineContentArray.map((_, i) => {
        return (
          <div
            key={i}
            className='h-3 mt-3 rounded-full bg-skeleton'
            data-testid='card-line-content'
          />
        )
      })}

      <div className={classNames('justify-between px-1 text-xs lg:text-sm', loading ? 'hidden' : 'flex')}>
        <span className='text-xs uppercase lg:text-sm'>
          <Trans>Utilization ratio</Trans>
        </span>
        <span
          className='text-xs font-semibold text-right lg:text-sm '
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
        <div className={classNames('mt-2 mb-4', loading ? 'hidden' : 'block')}>
          <ProgressBar
            value={utilization}
            bgClass={progressBgColor}
            fgClass={progressFgColor}
          />
        </div>
      </InfoTooltip>

      <div
        className={classNames('justify-between px-1 text-01052D opacity-40 text-xs lg:text-sm', loading ? 'hidden' : 'flex')}
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
