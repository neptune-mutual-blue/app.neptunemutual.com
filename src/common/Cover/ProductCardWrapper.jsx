import Link from 'next/link'

import { ProductCard } from '@/common/Cover/ProductCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'
import { classNames } from '@/utils/classnames'
import { getPolicyStatus } from '@/utils/policy-status'

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

  const { disabled } = getPolicyStatus(productData)

  return (
    (
      <Link
        href={Routes.ViewProduct(coverKey, productKey)}
        key={coverKey}
        className={classNames(
          'rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9',
          disabled && 'opacity-40'

        )}
        data-testid='cover-link'
      >

        <ProductCard
          productKey={productKey}
          productData={productData}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
          {...rest}
        />

      </Link>
    )
  )
}
