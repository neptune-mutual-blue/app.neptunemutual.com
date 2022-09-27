import Link from 'next/link'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { ProductCard } from '@/common/Cover/ProductCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'

export const ProductCardWrapper = ({
  coverKey,
  productKey,
  progressFgColor = undefined,
  progressBgColor = undefined
}) => {
  const productInfo = useCoverOrProductData({ coverKey, productKey })

  if (!productInfo) {
    return <CardSkeleton numberOfCards={1} />
  }

  return (
    <Link href={Routes.ViewProduct(coverKey, productKey)} key={coverKey}>
      <a
        className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
        data-testid='cover-link'
      >
        <ProductCard
          coverKey={coverKey}
          productKey={productKey}
          productInfo={productInfo}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
        />
      </a>
    </Link>
  )
}
