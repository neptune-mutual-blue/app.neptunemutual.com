import { Trans } from '@lingui/macro'
import { classNames } from '@/utils/classnames'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'

export const HomeMainCard = ({ heroData, className = '' }) => {
  return (
    <div
      className={classNames(
        'w-full max-w-96 py-6 lg:py-0 lg:h-full  bg-white rounded-2xl border-0.5 border-B0C4DB flex justify-center items-center px-12 shadow-homeCard',
        className
      )}
    >
      <div className='flex flex-col items-center justify-between w-full lg:py-4 border-r-0.5 border-E8E8ED'>
        <h4 className='mb-2 leading-5 font-poppins lg:mb-0 text-h7 lg:text-h5 text-9B9B9B'>
          <Trans>Available</Trans>
        </h4>
        <InfoTooltip
          infoComponent={
            <div>
              <p>{heroData?.currentNetwork?.dedicatedCoverCount} <Trans>Dedicated covers</Trans></p>
              <p>{heroData?.currentNetwork?.productCount} <Trans>Products</Trans></p>
            </div>
          }
        >
          <h4 className='font-bold leading-5 font-sora text-h5 lg:text-h3 text-4e7dd9'>
            {heroData.availableCovers}
          </h4>
        </InfoTooltip>
      </div>

      <div className='flex flex-col items-center justify-between w-full'>
        <h4 className='mb-2 lg:mb-0 font-poppins text-h7 lg:text-h5 text-9B9B9B'>
          <Trans>Reporting</Trans>
        </h4>
        <h4 className='font-bold leading-5 font-sora text-h5 lg:text-h3 text-4e7dd9'>
          {heroData.reportingCovers}
        </h4>
      </div>
    </div>
  )
}
