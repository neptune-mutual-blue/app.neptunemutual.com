import * as Tooltip from '@radix-ui/react-tooltip'

import { useRouter } from 'next/router'

import {
  Badge,
  E_CARD_STATUS
} from '@/common/CardStatusBadge'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { CoverAvatar } from '@/common/CoverAvatar'
import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { ProgressBar } from '@/common/ProgressBar/ProgressBar'
import { getCoverImgSrc } from '@/src/helpers/cover'
import {
  toBN
} from '@/utils/bn'
import { formatPercent } from '@/utils/formatter/percent'
import { Trans } from '@lingui/macro'
import { TokenAmountSpan } from '@/common/TokenAmountSpan'
import InfoCircleIcon from '@/icons/InfoCircleIcon'

export const MyLiquidityCoverCard = ({
  coverKey,
  totalPODs,
  tokenSymbol = 'POD',
  subProducts,
  coverData
}) => {
  const router = useRouter()

  const isDiversified = coverData?.supportsProducts
  const projectName = coverData.coverInfoDetails.coverName || coverData.coverInfoDetails.projectName

  const utilizationPercent = toBN(coverData?.utilizationRatio)

  return (
    <OutlinedCard className='p-6 bg-white' type='link'>
      <div className='flex justify-between'>
        <CoverAvatar
          imgs={isDiversified
            ? subProducts.map((productData) => {
              return {
                src: getCoverImgSrc({ key: productData.productKey }),
                alt: productData.productInfoDetails?.productName
              }
            })
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
          <Trans>Utilization Ratio</Trans>
        </span>
        <span className='font-semibold text-right' data-testid='assurance'>
          {formatPercent(utilizationPercent, router.locale)}
        </span>
      </div>
      <div className='mt-2 mb-4'>
        <ProgressBar value={utilizationPercent?.toNumber()} />
      </div>

      <div className='flex items-center gap-2'>
        <span data-testid='liquidity'>
          <Trans>My Liquidity</Trans>:{' '}
          <TokenAmountSpan
            amountInUnits={totalPODs}
            decimals={0}
            symbol={tokenSymbol}
          />

        </span>
        <BalanceMismatchInfo />
      </div>
    </OutlinedCard>
  )
}

const BalanceMismatchInfo = () => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger className='p-0.5'>
        <span className='sr-only'>Info</span>
        <InfoCircleIcon width={15} height={15} className='fill-9B9B9B' />
      </Tooltip.Trigger>

      <Tooltip.Content side='right'>
        <div className='w-full p-2 text-xs tracking-normal bg-black rounded-lg max-w-70 text-EEEEEE'>
          <p>
            <Trans>
              The POD token amount may not match your current balance if you've transferred the POD tokens to other wallets or staked them in our Liquidity Gauge Pools
            </Trans>
          </p>
        </div>
        <Tooltip.Arrow offset={16} className='fill-black' />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
