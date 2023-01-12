import { useRouter } from 'next/router'

import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import InfoCircleIcon from '@/icons/InfoCircleIcon'
import DateLib from '@/lib/date/DateLib'
import { MULTIPLIER } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  convertFromUnits,
  sumOf,
  toBN
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Trans } from '@lingui/macro'
import * as Tooltip from '@radix-ui/react-tooltip'

export const PolicyFeesAndExpiry = ({ value, data, coverageLag, quotationStep = true, referralCode, editForm = false, updatingFee }) => {
  const { fee, rate } = data
  const router = useRouter()
  const { liquidityTokenSymbol, liquidityTokenDecimals } = useAppConstants()

  const rateConverted = toBN(rate).dividedBy(MULTIPLIER).toString()
  const coverFee = convertFromUnits(fee, liquidityTokenDecimals).toString()

  const startsAt = DateLib.getEodInUTC(DateLib.fromUnix(sumOf(DateLib.unix(), coverageLag)))
  const expires = DateLib.fromUnix(data.expiryDate)

  const secondText = `${value} ${liquidityTokenSymbol}`

  return (
    <>
      <table className='w-full font-semibold text-black capitalize text-h6'>
        <tbody>
          <tr className='flex justify-between'>
            <th className='font-semibold text-left uppercase'>
              <Trans>Premium Rate</Trans>
            </th>
            <td className={classNames('text-right', quotationStep ? 'text-black font-normal' : 'text-4e7dd9')}>
              {updatingFee ? <DataLoadingIndicator className='mt-0' message='Fetching fees...' /> : formatPercent(rateConverted, router.locale)}
            </td>
          </tr>
          <tr className='flex justify-between mt-3'>
            <th className='font-semibold text-left uppercase'>
              {quotationStep ? <Trans>Your Cover Amount</Trans> : <Trans>Cover Fee</Trans>}
            </th>
            <td className={classNames('text-right', quotationStep ? 'text-black font-normal' : 'text-4e7dd9')} title={!quotationStep && formatCurrency(coverFee, router.locale, liquidityTokenSymbol, true).long}>
              {updatingFee && <DataLoadingIndicator className='mt-0' message='Fetching fees...' />}
              {!updatingFee && (quotationStep ? secondText : formatCurrency(coverFee, router.locale, liquidityTokenSymbol, true).short)}
            </td>
          </tr>
          <tr className='flex justify-between mt-3'>
            <th className='font-semibold text-left uppercase'>
              {quotationStep
                ? <Trans>Cover Expires On</Trans>
                : <Trans>Coverage Period</Trans>}
            </th>
            {!editForm && (
              <td className={classNames('text-right flex justify-center', quotationStep ? 'text-black font-normal' : 'text-4e7dd9')}>
                {!quotationStep && DateLib.toLongDateFormat(startsAt, router.locale, 'UTC', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}{' '}
                {!quotationStep && '-'}{' '}
                {DateLib.toLongDateFormat(expires, router.locale, 'UTC', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  timeZoneName: 'short'
                })}
                {/* Tooltip */}
                {!quotationStep && <CoveragePeriodTooltip startsAt={startsAt} endsAt={expires} />}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {!editForm && (
        <>
          <hr className='mt-4 border-t border-d4dfee' />
          <tr className='flex justify-between mt-3'>
            <th className='font-semibold tracking-wider text-left uppercase'>
              <Trans>Cashback Code</Trans>
            </th>
            <td className='text-right text-4e7dd9'>
              {referralCode || <span className='font-semibold'>-</span>}
            </td>
          </tr>
        </>
      )}
    </>
  )
}

/**
 *
 * @param {{startsAt: Date, endsAt: Date}} param0
 */
const CoveragePeriodTooltip = ({ startsAt, endsAt }) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger className='pl-0.5'>
        <span className='sr-only'>Info</span>
        <InfoCircleIcon width={15} height={15} className='fill-9B9B9B' />
      </Tooltip.Trigger>

      <Tooltip.Content side='top'>
        <div className='px-4 py-4 text-xs tracking-normal bg-black rounded-lg md:max-w-md max-w-60 text-EEEEEE'>
          <p>
            <strong>
              <Trans>Starts At</Trans>:
            </strong>{' '}
            {startsAt.toString()}
          </p>
          <p>
            <strong>
              <Trans>Expires At</Trans>:
            </strong>{' '}
            {endsAt.toString()}
          </p>
        </div>
        <Tooltip.Arrow offset={16} className='fill-black' />
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
