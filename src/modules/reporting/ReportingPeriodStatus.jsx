import DateLib from '@/lib/date/DateLib'
import InfoIcon from '@/lib/toast/components/icons/InfoIcon'
import { useLanguageContext } from '@/src/i18n/i18n'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'
import * as Tooltip from '@radix-ui/react-tooltip'

export const ReportingPeriodStatus = ({ resolutionTimestamp }) => {
  const { locale } = useLanguageContext()
  const endDate = DateLib.fromUnix(resolutionTimestamp)

  const isPast = DateLib.toUnix(new Date()) > DateLib.toUnix(endDate)
  const longDate = (
    <>
      <br />
      {DateLib.toLongDateFormat(endDate, locale)}
    </>
  )

  return (
    <div className='flex items-center mb-2'>
      <p className='text-sm font-bold'>{fromNow(endDate, locale)}</p>
      <Tooltip.Root>
        <Tooltip.Trigger className='p-1 mr-4 text-9B9B9B'>
          <InfoIcon className='w-4 h-4 text-999BAB' aria-hidden='true' />
        </Tooltip.Trigger>
        <Tooltip.Content side='top'>
          <div className='max-w-md p-2 text-xs text-white bg-black rounded'>
            {isPast
              ? (
                <Trans>This report concluded on {longDate}</Trans>
                )
              : (
                <Trans>This report will be concluded on {longDate}</Trans>
                )}
          </div>
          <Tooltip.Arrow offset={16} className='fill-black' />
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}
