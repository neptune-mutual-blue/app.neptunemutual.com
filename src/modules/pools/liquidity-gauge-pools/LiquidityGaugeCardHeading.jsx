import { CoverAvatar } from '@/common/CoverAvatar'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { getCoverImgSrc } from '@/src/helpers/cover'

export const LiquidityGaugeCardHeading = ({ poolKey, title, stakingTokenSymbol }) => {
  const { loading, getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts2()

  const coverData = getCoverByCoverKey(poolKey)
  const isDiversified = coverData?.supportsProducts

  return (
    <div className='flex gap-6.5 items-start md:items-center flex-col md:flex-row'>
      <div className='flex flex-col gap-1'>
        <h1 className='text-xl font-semibold text-01052D'>{title}</h1>
        <p className='text-sm text-999BAB'>Lock {stakingTokenSymbol}</p>
        {/* <p className='text-sm text-999BAB'>Receive {rewardTokenSymbol}</p> */}
      </div>

      {!loading && (
        <CoverAvatar
          imgs={isDiversified
            ? getProductsByCoverKey(poolKey).map(x => {
              return {
                src: getCoverImgSrc({ key: x.productKey }),
                alt: x.productInfoDetails?.productName
              }
            })
            : [{
                src: getCoverImgSrc({ key: poolKey }),
                alt: coverData?.coverInfoDetails?.coverName || coverData?.coverInfoDetails?.projectName || ''
              }]}
        />
      )}
    </div>
  )
}
