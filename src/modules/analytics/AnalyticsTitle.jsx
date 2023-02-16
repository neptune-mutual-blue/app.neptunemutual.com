import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { AnalyticsDropdown } from '@/src/modules/analytics/AnalyticsDropdown'

export const AnalyticsTitle = ({ options, selected, setSelected, trailing }) => {
  return (
    <div>
      <div className='hidden lg:flex items-center justify-between pb-10 flex-start'>
        <div className='flex'>
          <div className='mr-6 font-bold leading-9 text-h3 lg:text-h2 font-sora text-000000'>
            Analytics
          </div>

          <div className='text-sm text-000000'>
            <AnalyticsDropdown
              options={options}
              setSelected={setSelected}
              selected={selected}
              icon={<ChevronDownIcon className='w-4 h-4' aria-hidden='true' />}
            />
          </div>
        </div>
        {trailing}
      </div>
      <div className='lg:hidden'>
        <div className='flex items-center justify-between pb-4 flex-start '>
          <div className='w-full'>
            <div className='flex items-center justify-between'>
              <div className='mr-6 font-bold leading-9 text-h3 lg:text-h2 font-sora text-000000'>
                Analytics
              </div>
              {trailing}
            </div>
          </div>
        </div>
        <div className='flex flex-wrap'>
          <div className='text-sm text-000000 pb-6 w-full'>
            <AnalyticsDropdown
              options={options}
              setSelected={setSelected}
              selected={selected}
              icon={<ChevronDownIcon className='w-4 h-4' aria-hidden='true' />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
