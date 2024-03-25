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
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Trans } from '@lingui/macro'

export const CoverCard = ({
  coverKey,
  coverData,
  progressFgColor = undefined,
  progressBgColor = undefined,
  className = ''
}) => {
  const { locale } = useLanguageContext()
  const { liquidityTokenDecimals } = useAppConstants()
  const { getProductsByCoverKey } = useCoversAndProducts2()

  const productStatus = CoverStatus[coverData.productStatus]

  const capacity = coverData.capacity
  const utilization = coverData.utilizationRatio

  const protection = formatCurrency(
    convertFromUnits(coverData.commitment, liquidityTokenDecimals).toString(),
    locale
  )
  const protectionLong = protection.long
  const protectionShort = protection.short

  const formattedCapacity = formatCurrency(
    convertFromUnits(capacity, liquidityTokenDecimals).toString(),
    locale
  )
  const capacityLong = formattedCapacity.long
  const capacityShort = formattedCapacity.short

  const isDiversified = coverData?.supportsProducts
  const status = isDiversified ? E_CARD_STATUS.DIVERSIFIED : identifyStatus(productStatus)

  return (
    <OutlinedCard className={classNames('p-6 bg-white', className)} type='link'>
      <div className='flex items-start min-h-72'>
        <CoverAvatar
          imgs={isDiversified
            ? getProductsByCoverKey(coverKey).map(x => {
              return {
                src: getCoverImgSrc({ key: x.productKey }),
                alt: x.productInfoDetails?.productName
              }
            })
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
        className='mt-4 text-lg font-semibold text-black uppercase'
        data-testid='project-name'
      >
        {coverData.coverInfoDetails.coverName || coverData.coverInfoDetails.projectName}
      </p>
      <div
        className='mt-1 text-xs uppercase opacity-40 lg:text-sm text-01052D lg:mt-2'
        data-testid='cover-fee'
      >
        <Trans>Annual Cover fee:</Trans>{' '}
        {formatPercent(
          toBN(coverData.floor).dividedBy(MULTIPLIER),
          locale
        )}
        -
        {formatPercent(
          toBN(coverData.ceiling).dividedBy(MULTIPLIER),
          locale
        )}
      </div>

      {/* Divider */}
      <Divider className='mb-4 lg:mb-8' />

      {/* Stats */}
      <div className='flex justify-between px-1 text-xs lg:text-sm'>
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
                <Trans>Utilization ratio:</Trans>{' '}
                {formatPercent(utilization, locale)}
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

      <div className='flex justify-between px-1 text-xs text-01052D opacity-40 lg:text-sm'>
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
          >
            <span role='tooltip' aria-label='Protection'>
              <SheildIcon className='w-4 h-4 text-01052D' />
            </span>
            <p data-testid='protection'>
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
