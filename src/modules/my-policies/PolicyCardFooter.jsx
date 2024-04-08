import Link from 'next/link'
import { useRouter } from 'next/router'

import DateLib from '@/lib/date/DateLib'
import { Routes } from '@/src/config/routes'
import { useAppConstants } from '@/src/context/AppConstants'
import { convertFromUnits } from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const PolicyCardFooter = ({
  coverKey,
  productKey,
  isPolicyExpired,
  beforeResolutionDeadline,
  withinClaimPeriod,
  isClaimable,
  claimBeginsFrom,
  claimExpiresAt,
  incidentDate,
  validityEndsAt,
  amountToCover
}) => {
  const router = useRouter()
  const { liquidityTokenDecimals } = useAppConstants()

  const formattedAmountToCover = formatCurrency(
    convertFromUnits(amountToCover, liquidityTokenDecimals),
    router.locale
  )

  const { i18n } = useLingui()

  const stats = []
  if (withinClaimPeriod) {
    stats.push({
      title: t(i18n)`Claim Before`,
      tooltipText: DateLib.toLongDateFormat(
        claimExpiresAt,
        router.locale
      ),
      value: fromNow(claimExpiresAt, router.locale),
      variant: 'error'
    })
  } else if (beforeResolutionDeadline) {
    stats.push({
      title: t(i18n)`Resolution By`,
      tooltipText: DateLib.toLongDateFormat(
        claimBeginsFrom,
        router.locale
      ),
      value: fromNow(claimBeginsFrom, router.locale)
    })
  } else if (isPolicyExpired) {
    stats.push({
      title: t(i18n)`Expired On`,
      tooltipText: DateLib.toLongDateFormat(validityEndsAt, router.locale),
      value: fromNow(validityEndsAt, router.locale)
    })
  } else {
    stats.push({
      title: t(i18n)`Expires In`,
      tooltipText: DateLib.toLongDateFormat(validityEndsAt, router.locale),
      value: fromNow(validityEndsAt, router.locale)
    })
  }

  return (
    <>
      {/* Stats */}
      <div
        className='flex flex-wrap justify-between px-1 text-sm'
        data-testid='policy-card-footer'
      >
        {stats.map((stat, idx) => {
          return (
            <Stat
              key={stat.title}
              title={stat.title}
              tooltip={stat.tooltipText}
              value={stat.value}
              variant={stat.variant}
              right={idx % 2 === 1}
            />
          )
        })}

        <Stat
          title={t(i18n)`Purchased Policy`}
          tooltip={formattedAmountToCover.long}
          value={formattedAmountToCover.short}
          right
        />
      </div>

      {/* Link */}
      {isClaimable && withinClaimPeriod && !isPolicyExpired && (
        (
          <Link
            href={Routes.ClaimPolicy(coverKey, productKey, incidentDate)}
            className='flex justify-center py-2.5 w-full text-white text-sm font-semibold uppercase rounded-lg mt-2 mb-4 bg-primary'
            data-testid='claim-link'
          >

            <Trans>Claim</Trans>

          </Link>
        )
      )}
    </>
  )
}

export const Stat = ({ title, tooltip, value, right, variant = '' }) => {
  return (
    <div
      className={classNames('flex flex-col basis-1/2', right && 'items-end')}
      data-testid='footer-stat'
    >
      <h5 className='mb-2 text-sm font-semibold text-black'>{title}</h5>
      <p
        title={tooltip}
        className={classNames(
          'mb-4',
          variant === 'error' ? 'text-FA5C2F' : 'text-7398C0'
        )}
      >
        {value}
      </p>
    </div>
  )
}
