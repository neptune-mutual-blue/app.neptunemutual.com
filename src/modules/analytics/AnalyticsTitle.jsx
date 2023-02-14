import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { AnalyticsDropdown } from '@/src/modules/analytics/AnalyticsDropdown'

export const AnalyticsTitle = ({ options, selected, setSelected, statsData, loading }) => {
  return (
    <div>
      <div className='hidden lg:block'>
        <div className='flex flex-start items-center justify-between pb-10'>
          <div className='flex'>
            <div className='text-h3 lg:text-h2 font-sora font-bold leading-9 mr-6 text-000000'>
              Analytics
            </div>

            <div className='text-sm'>
              <AnalyticsDropdown options={options} setSelected={setSelected} selected={selected} icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />} />
            </div>
          </div>
          <div className='text-21AD8C text-sm leading-5'>
            {loading ? '' : `${statsData?.combined?.availableCovers} Covers, ${statsData?.combined?.reportingCovers} Reporting`}
          </div>
        </div>
      </div>
      <div className='block lg:hidden'>
        <div className='flex flex-start items-center justify-between pb-4'>
          <div className='flex'>
            <div className='text-h3 lg:text-h2 font-sora font-bold leading-9 mr-6 text-000000'>
              Analytics
            </div>
          </div>
          <div className='text-21AD8C text-sm leading-5'>
            {loading ? '' : `${statsData?.combined?.availableCovers} Covers, ${statsData?.combined?.reportingCovers} Reporting`}
          </div>
        </div>
        <div className='text-sm pb-6'>
          <AnalyticsDropdown buttonClass='pl-0' labelClass='ml-4' options={options} setSelected={setSelected} selected={selected} icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />} />
        </div>
      </div>
    </div>
  )
}
