import { classNames } from '@/utils/classnames'
import { Trans } from '@lingui/macro'

export const HorizontalChartLegend = () => {
  return (
    <div className='flex justify-between mt-6 mb-8 md:justify-center md:space-x-6 md:flex-wrap md:mb-12'>
      <LegendItem variant='success'>
        <Trans>Incident Occurred</Trans>
      </LegendItem>
      <LegendItem variant='error'>
        <Trans>False Reporting</Trans>
      </LegendItem>
    </div>
  )
}

const LegendItem = ({ variant, children }) => {
  return (
    <div className='flex items-center'>
      <div
        className={classNames(
          'w-4 h-4 mr-2 md:mr-2.5 rounded',
          variant === 'success' ? 'bg-21AD8C' : 'bg-FA5C2F'
        )}
      />
      <p
        className={classNames(
          'text-sm font-semibold',
          variant === 'success' ? 'text-21AD8C' : 'text-FA5C2F'
        )}
      >
        {children}
      </p>
    </div>
  )
}
