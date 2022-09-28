import * as Tooltip from '@radix-ui/react-tooltip'
import DateLib from '@/lib/date/DateLib'
import { MULTIPLIER } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { convertFromUnits, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import { Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import InfoCircleIcon from '@/icons/InfoCircleIcon'

export const PolicyFeesAndExpiry = ({ data }) => {
  const { fee, rate } = data
  const router = useRouter()
  const { liquidityTokenDecimals, liquidityTokenSymbol } = useAppConstants()

  const rateConverted = toBN(rate).dividedBy(MULTIPLIER).toString()
  const coverFee = convertFromUnits(fee, liquidityTokenDecimals).toString()

  const expires = DateLib.fromUnix(data.expiryDate)

  return (
    <>
      <hr className='py-1 mb-4 border-t mt-14 border-d4dfee' />
      <table className='w-full font-semibold text-black uppercase text-h6'>
        <tbody>
          <tr className='flex justify-between mt-3'>
            <th className='font-semibold text-left'>
              <Trans>Fees</Trans>
            </th>
            <td className='text-right text-4e7dd9'>
              {formatPercent(rateConverted, router.locale)}
            </td>
          </tr>
          <tr className='flex justify-between mt-3'>
            <th className='font-semibold text-left'>
              <Trans>Cover Fee</Trans>
            </th>
            <td
              className='text-right text-4e7dd9'
              title={
                formatCurrency(
                  coverFee,
                  router.locale,
                  liquidityTokenSymbol,
                  true
                ).long
              }
            >
              {
                formatCurrency(
                  coverFee,
                  router.locale,
                  liquidityTokenSymbol,
                  true
                ).short
              }
            </td>
          </tr>
          <tr className='flex justify-between mt-3'>
            <th className='font-semibold text-left'>
              <Trans>Coverage Period</Trans>
            </th>
            <td className='text-right text-4e7dd9'>
              {DateLib.toLongDateFormat(new Date(), router.locale, 'UTC', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}{' '}
              -{' '}
              {DateLib.toLongDateFormat(expires, router.locale, 'UTC', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
              {/* Tooltip */}
              <CoveragePeriodTooltip startsAt={new Date()} endsAt={expires} />
            </td>
          </tr>
        </tbody>
      </table>
      <hr className='mt-4 border-t border-d4dfee' />
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
      <Tooltip.Trigger className='p-0.5'>
        <span className='sr-only'>Info</span>
        <InfoCircleIcon width={24} className='fill-9B9B9B' />
      </Tooltip.Trigger>

      <Tooltip.Content side='top'>
        <div className='max-w-md px-4 py-4 text-xs tracking-normal bg-black rounded-lg text-EEEEEE'>
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
