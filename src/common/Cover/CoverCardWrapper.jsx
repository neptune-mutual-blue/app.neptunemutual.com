import Link from 'next/link'

import { CoverCard } from '@/common/Cover/CoverCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { utils } from '@neptunemutual/sdk'

export const CoverCardWrapper = ({
  coverKey,
  progressFgColor = undefined,
  progressBgColor = undefined,
  ...rest
}) => {
  const productKey = utils.keyUtil.toBytes32('')
  const { coverInfo } = useCoverOrProductData({ coverKey, productKey })

  if (!coverInfo) {
    return <CardSkeleton numberOfCards={1} {...rest} />
  }

  return (
    <Link href={Routes.ViewCover(coverKey)} key={coverKey} scroll={!coverInfo.supportsProducts}>
      <a
        className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
        data-testid='cover-link'
      >
        <CoverCard
          coverKey={coverKey}
          coverInfo={coverInfo}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
          {...rest}
        />
      </a>
    </Link>
  )
}
