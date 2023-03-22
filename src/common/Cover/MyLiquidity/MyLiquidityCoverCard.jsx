import { Badge, E_CARD_STATUS } from '@/common/CardStatusBadge'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { CoverAvatar } from '@/common/CoverAvatar'
import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { ProgressBar } from '@/common/ProgressBar/ProgressBar'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useMyLiquidityInfo } from '@/src/hooks/useMyLiquidityInfo'
import { convertFromUnits, sumOf, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Trans } from '@lingui/macro'
import { useRouter } from 'next/router'

export const MyLiquidityCoverCard = ({
  coverKey,
  totalPODs,
  tokenSymbol = 'POD',
  tokenDecimal,
  subProducts,
  coverData
}) => {
  const router = useRouter()
  const { info } = useMyLiquidityInfo({ coverKey })

  const isDiversified = coverData?.supportsProducts
  const projectName = coverData.coverInfoDetails.coverName || coverData.coverInfoDetails.projectName

  const reassurancePercent = toBN(info.totalReassurance)
    .dividedBy(sumOf(info.totalLiquidity, info.totalReassurance))
    .decimalPlaces(2)

  return (
    <OutlinedCard className='p-6 bg-white' type='link'>
      <div className='flex justify-between'>
        <CoverAvatar
          imgs={isDiversified
            ? subProducts.map((productData) => ({
              src: getCoverImgSrc({ key: productData.productKey }),
              alt: productData.productInfoDetails?.productName
            }))
            : [{
                src: getCoverImgSrc({ key: coverKey }),
                alt: projectName
              }]}
        />
        <div>
          {/* <Badge className="text-21AD8C">APR: {"25"}%</Badge> */}
          <InfoTooltip
            disabled={!isDiversified}
            infoComponent={
              <div>
                <p>
                  Leverage Factor: <b>{coverData.leverage}x</b>
                </p>
                <p>Determines available capital to underwrite</p>
              </div>
            }
          >
            <div>
              {isDiversified && (
                <Badge status={E_CARD_STATUS.DIVERSIFIED} className='rounded' />
              )}
            </div>
          </InfoTooltip>
        </div>
      </div>
      <h4
        className='mt-4 text-lg font-semibold uppercase'
        data-testid='title'
      >
        {projectName}
      </h4>
      {/* Divider */}
      <Divider />
      {/* Stats */}
      <div className='flex justify-between px-1 text-sm'>
        <span className='uppercase'>
          <Trans>Reassurance Ratio</Trans>
        </span>
        <span className='font-semibold text-right' data-testid='assurance'>
          {formatPercent(reassurancePercent, router.locale)}
        </span>
      </div>
      <div className='mt-2 mb-4'>
        <ProgressBar value={reassurancePercent?.toNumber()} />
      </div>
      <div
        className='flex justify-between px-1 text-sm'
        title={
          formatCurrency(
            convertFromUnits(totalPODs || '0', tokenDecimal),
            router.locale,
            tokenSymbol,
            true
          ).long
        }
      >
        <span data-testid='liquidity'>
          <Trans>My Liquidity</Trans>:{' '}
          {
            formatCurrency(
              convertFromUnits(totalPODs || '0', tokenDecimal),
              router.locale,
              tokenSymbol,
              true
            ).short
          }
        </span>
      </div>
    </OutlinedCard>
  )
}
