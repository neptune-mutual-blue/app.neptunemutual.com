import Link from 'next/link'

import { CoverCard } from '@/common/Cover/CoverCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import { Routes } from '@/src/config/routes'
import { classNames } from '@/utils/classnames'
import { getPolicyStatus } from '@/utils/policy-status'

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

  const { disabled } = getPolicyStatus(coverData)

  return (
    (
      <Link
        href={Routes.ViewCover(coverKey)}
        key={coverKey}
        scroll={!coverData.supportsProducts}
        className={classNames(
          'rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9',
          disabled && 'opacity-40'
        )}
        data-testid='cover-link'
      >

        <CoverCard
          coverKey={coverKey}
          coverData={coverData}
          progressFgColor={progressFgColor}
          progressBgColor={progressBgColor}
          {...rest}
        />

      </Link>
    )
  )
}
