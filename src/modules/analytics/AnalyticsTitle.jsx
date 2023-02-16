import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { AnalyticsDropdown } from '@/src/modules/analytics/AnalyticsDropdown'

export const AnalyticsTitle = ({ title = 'Analytics', options, selected, setSelected, trailing, leading }) => {
  return (
    <div className='flex items-center justify-between pb-10 flex-start'>
      <div className='flex items-center'>
        {leading}
        <div className='mr-6 font-bold leading-9 text-h2 font-sora text-000000'>
          {title}
        </div>

        {!leading && (
          <div className='text-sm text-000000'>
            <AnalyticsDropdown
              options={options}
              setSelected={setSelected}
              selected={selected}
              icon={<ChevronDownIcon className='w-4 h-4' aria-hidden='true' />}
            />
          </div>)}
      </div>
      {trailing}
    </div>
  )
}
