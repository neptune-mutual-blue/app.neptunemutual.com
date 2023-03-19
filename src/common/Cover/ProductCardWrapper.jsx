import { ProductCard } from '@/common/Cover/ProductCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import Link from 'next/link'

export const ProductCardWrapper = ({
  coverKey,
  productKey,
  progressFgColor = undefined,
  progressBgColor = undefined,
  ...rest
}) => {
  const { getProduct } = useCoversAndProducts2()
  const productData = getProduct(coverKey, productKey)

  if (!productData) {
    return <CardSkeleton numberOfCards={1} {...rest} />
  }

  return (
    <Link
      href={Routes.ViewProduct(coverKey, productKey)}
      key={coverKey}
      className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
      data-testid='cover-link'
    >

      <ProductCard
        coverKey={coverKey}
        productKey={productKey}
        productData={productData}
        progressFgColor={progressFgColor}
        progressBgColor={progressBgColor}
        {...rest}
      />

    </Link>
  )
}
