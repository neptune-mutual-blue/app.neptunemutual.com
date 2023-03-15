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
import { useAppConstants } from '@/src/context/AppConstants'
import { utils } from '@neptunemutual/sdk'
import { Badge, E_CARD_STATUS, identifyStatus } from '@/common/CardStatusBadge'
import SheildIcon from '@/icons/SheildIcon'
import { CoverAvatar } from '@/common/CoverAvatar'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { classNames } from '@/utils/classnames'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { getCoverImgSrc } from '@/src/helpers/cover'

export const CoverCard = ({
  coverKey,
  coverData,
  progressFgColor = undefined,
  progressBgColor = undefined,
  className = ''
}) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()
  const { getProductsByCoverKey } = useCoversAndProducts2()

  const productKey = utils.keyUtil.toBytes32('')

  const { info: coverStats } = useFetchCoverStats({ coverKey, productKey })
  const { productStatus } = coverStats

  const isDiversified = coverData?.coverInfoDetails?.supportsProducts

  const capacity = coverData.capacity
  const utilization = coverData.utilizationRatio

  const protectionLong = formatCurrency(
    convertFromUnits(coverData.commitment, liquidityTokenDecimals).toString(),
    router.locale
  ).long
  const protectionShort = formatCurrency(
    convertFromUnits(coverData.commitment, liquidityTokenDecimals).toString(),
    router.locale
  ).short

  const capacityLong = formatCurrency(
    convertFromUnits(capacity, liquidityTokenDecimals).toString(),
    router.locale
  ).long

  const capacityShort = formatCurrency(
    convertFromUnits(capacity, liquidityTokenDecimals).toString(),
    router.locale
  ).short

  const status = isDiversified
    ? E_CARD_STATUS.DIVERSIFIED
    : identifyStatus(productStatus)

  return (
    <OutlinedCard className={classNames('p-6 bg-white', className)} type='link'>
      <div className='flex items-start min-h-72'>
        <CoverAvatar
          imgs={isDiversified
            ? getProductsByCoverKey(coverKey).map(x => ({
              src: getCoverImgSrc({ key: x.productKey }),
              alt: x.productInfoDetails?.productName
            }))
            : [{
                src: getCoverImgSrc({ key: coverKey }),
                alt: coverData.coverInfoDetails.coverName || coverData.coverInfoDetails.projectName
              }]}
        />
        <div>
          {status !== E_CARD_STATUS.NORMAL && (
            <Badge status={status} className='rounded' />
          )}
        </div>
      </div>
      <p
        className='mt-4 font-semibold text-black uppercase text-h4'
        data-testid='project-name'
      >
        {coverData.coverInfoDetails.coverName || coverData.coverInfoDetails.projectName}
      </p>
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
              <Trans>Liquidity</Trans>: {capacityLong}
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
              {protectionShort}
            </p>
          </div>
        </InfoTooltip>
        <InfoTooltip
          arrow={false}
          infoComponent={
            <div>
              <Trans>Liquidity</Trans>: {capacityLong}
            </div>
          }
        >
          <div
            className='flex-1 text-right'
            title={capacityLong}
            data-testid='liquidity'
          >
            {capacityShort}
          </div>
        </InfoTooltip>
      </div>
    </OutlinedCard>
  )
}
