import Link from 'next/link'
import { useRouter } from 'next/router'

import DateLib from '@/lib/date/DateLib'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { log } from '@/src/services/logs'
import {
  convertFromUnits,
  isGreater
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { fromNow } from '@/utils/formatter/relative-time'
import { analyticsLogger } from '@/utils/logger'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export const PolicyCardFooter = ({
  coverKey,
  productKey,
  report,
  validityEndsAt,
  cxToken,
  tokenBalance
}) => {
  const now = DateLib.unix()
  const router = useRouter()
  const { networkId } = useNetwork()
  const { isMainNet, isArbitrum } = useValidateNetwork(networkId)
  const cxTokenDecimals = useTokenDecimals(cxToken.id)

  const isClaimable = report ? report.status === 'Claimable' : false
  const isClaimStarted = report && isGreater(now, report.claimBeginsFrom)
  const isClaimExpired = report && isGreater(now, report.claimExpiresAt)
  const isPolicyExpired = isGreater(now, validityEndsAt)

  const hasBalance = isGreater(tokenBalance, '0')
  const withinClaimPeriod =
    hasBalance && isClaimable && isClaimStarted && !isClaimExpired
  const beforeResolutionDeadline = isClaimable && !isClaimStarted

  const stats = []
  if (withinClaimPeriod) {
    stats.push({
      title: t`Claim Before`,
      tooltipText: DateLib.toLongDateFormat(
        report.claimExpiresAt,
        router.locale
      ),
      value: fromNow(report.claimExpiresAt),
      variant: 'error'
    })
  } else if (beforeResolutionDeadline) {
    stats.push({
      title: t`Resolution By`,
      tooltipText: DateLib.toLongDateFormat(
        report.claimBeginsFrom,
        router.locale
      ),
      value: fromNow(report.claimBeginsFrom)
    })
  } else if (isPolicyExpired) {
    stats.push({
      title: t`Expired On`,
      tooltipText: DateLib.toLongDateFormat(validityEndsAt, router.locale),
      value: fromNow(validityEndsAt)
    })
  } else {
    stats.push({
      title: t`Expires In`,
      tooltipText: DateLib.toLongDateFormat(validityEndsAt, router.locale),
      value: fromNow(validityEndsAt)
    })
  }

  const { account, chainId } = useWeb3React()

  const { coverInfo } = useCoverOrProductData({
    coverKey: coverKey,
    productKey: productKey
  })

  const handleLog = () => {
    const funnel = 'Claim Cover'
    const journey = 'my-policies-page'

    const step = 'claim-button'
    const sequence = 1
    const event = 'click'
    let props

    const expiryDate = parseInt(report?.claimExpiresAt)
    const d = new Date(expiryDate)
    const expiryDateMonth = d.getMonth() + 1
    const expiryDateMonthFormatted = d.toLocaleString('default', { month: 'long' })

    if (coverInfo?.cover) {
      props = {
        coverKey,
        coverName: coverInfo.cover.infoObj.coverName,
        productKey,
        productName: coverInfo.infoObj.productName,
        expiryDate,
        expiryDateMonth,
        expiryDateMonthFormatted
      }
    }

    if (!coverInfo?.cover) {
      props = {
        coverKey,
        coverName: coverInfo.infoObj.coverName,
        expiryDate,
        expiryDateMonth,
        expiryDateMonthFormatted
      }
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, props)
    })
  }

  const buttonBg = isArbitrum
    ? 'bg-1D9AEE'
    : isMainNet
      ? 'bg-4e7dd9'
      : 'bg-5D52DC'

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
          title={t`Purchased Policy`}
          tooltip={
            formatCurrency(
              convertFromUnits(tokenBalance, cxTokenDecimals),
              router.locale
            ).long
          }
          value={
            formatCurrency(
              convertFromUnits(tokenBalance, cxTokenDecimals),
              router.locale
            ).short
          }
          right
        />
      </div>

      {/* Link */}
      {report && withinClaimPeriod && (
        <Link
          href={Routes.ClaimPolicy(coverKey, productKey, report.incidentDate)}
        >
          <a
            className={classNames(
              'flex justify-center py-2.5 w-full text-white text-sm font-semibold uppercase rounded-lg mt-2 mb-4',
              buttonBg
            )}
            data-testid='claim-link'
            onClick={handleLog}
          >
            <Trans>Claim</Trans>
          </a>
        </Link>
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
