import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { useAllCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export const HomeMainCard = ({ className = '' }) => {
  const { getAllProducts, getDedicatedCovers } = useAllCoversAndProducts()
  const dedicatedCovers = getDedicatedCovers()
  const availableProducts = getAllProducts()
  const productsOfDiversifiedCoversCount = availableProducts.length - dedicatedCovers.length

  const activeReportingProducts = availableProducts.filter(x => { return x.productStatus !== 0 })

  return (
    <div
      className={classNames(
        'w-full max-w-96 py-6 lg:py-0 lg:h-full  bg-white rounded-2xl border-0.5 border-B0C4DB flex justify-center items-center px-12 shadow-homeCard',
        className
      )}
    >
      <div className='flex flex-col items-center justify-between w-full lg:py-4 border-r-0.5 border-E8E8ED'>
        <h4 className='mb-2 text-xs leading-5 lg:mb-0 lg:text-md text-9B9B9B'>
          <Trans>Available</Trans>
        </h4>
        <InfoTooltip
          infoComponent={
            <div>
              <p>{dedicatedCovers.length} <Trans>Dedicated covers</Trans></p>
              <p>{productsOfDiversifiedCoversCount} <Trans>Products</Trans></p>
            </div>
          }
        >
          <h4 className='font-bold leading-5 text-md lg:text-display-xs text-4E7DD9'>
            {availableProducts.length}
          </h4>
        </InfoTooltip>
      </div>

      <div className='flex flex-col items-center justify-between w-full'>
        <h4 className='mb-2 text-xs lg:mb-0 lg:text-md text-9B9B9B'>
          <Trans>Reporting</Trans>
        </h4>
        <h4 className='font-bold leading-5 text-md lg:text-display-xs text-4E7DD9'>
          {activeReportingProducts.length}
        </h4>
      </div>
    </div>
  )
}
