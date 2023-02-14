import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { AnalyticsDropdown } from '@/src/modules/analytics/AnalyticsDropdown'

export const AnalyticsTitle = ({ options, selected, setSelected, trailing }) => {
  return (
    <div className='flex flex-start items-center justify-between pb-10'>
      <div className='flex'>
        <div className='text-h2 font-sora font-bold leading-9 mr-6 text-000000'>
          Analytics
        </div>

        <div className='text-sm'>
          <AnalyticsDropdown options={options} setSelected={setSelected} selected={selected} icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />} />
        </div>
      </div>
      {trailing}
    </div>
  )
}
