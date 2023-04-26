import Link from 'next/link'

import { ProductCard } from '@/common/Cover/ProductCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'

export const ProductCardWrapper = ({
  coverKey,
  productKey,
  productData,
  progressFgColor = undefined,
  progressBgColor = undefined,
  ...rest
}) => {
  if (!productData) {
    return <CardSkeleton numberOfCards={1} {...rest} />
  }

  return (
    <Link href={Routes.ViewProduct(coverKey, productKey)} key={coverKey}>
      <a
        className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
        data-testid='cover-link'
      >
        <ProductCard
          productKey={productKey}
          productData={productData}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
          {...rest}
        />
      </a>
    </Link>
  )
}
