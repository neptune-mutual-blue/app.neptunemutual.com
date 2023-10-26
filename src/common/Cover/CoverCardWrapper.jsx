import Link from 'next/link'

import { CoverCard } from '@/common/Cover/CoverCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'

export const CoverCardWrapper = ({
  coverKey,
  coverData,
  progressFgColor = undefined,
  progressBgColor = undefined,
  ...rest
}) => {
  if (!coverData) {
    return <CardSkeleton numberOfCards={1} {...rest} />
  }

  return (
    <Link legacyBehavior href={Routes.ViewCover(coverKey)} key={coverKey} scroll={!coverData.supportsProducts}>
      <a
        className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
        data-testid='cover-link'
      >
        <CoverCard
          coverKey={coverKey}
          coverData={coverData}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
          {...rest}
        />
      </a>
    </Link>
  )
}
