import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { InsightsDropdown } from '@/src/modules/insights/InsightsDropdown'

export const InsightsTitle = ({ title = 'Insights', options, selected, setSelected, trailing, leading, trailAfterDropdownInMobile = false }) => {
  const analyticsDropdown = (
    <div className='w-full mb-6 text-sm text-000000 lg:mb-0 lg:w-auto'>
      <InsightsDropdown
        options={options}
        setSelected={setSelected}
        selected={selected}
        icon={<ChevronDownIcon className='w-4 h-4' aria-hidden='true' />}
      />
    </div>
  )

  return (
    <>
      <div className='items-center justify-between hidden pb-10 lg:flex flex-start'>
        <div className='flex items-center'>
          {leading}
          <div className='mr-6 font-bold leading-9 text-h2 font-inter text-000000'>
            {title}
          </div>
          {!leading && (analyticsDropdown)}
        </div>
        {trailing}
      </div>
      <div className='lg:hidden'>
        {leading && (
          <div className='mb-4'>
            {leading}
          </div>)}
        <div className='flex items-center justify-between pb-4 flex-start '>
          <div className='w-full'>
            <div className='flex items-center justify-between'>
              <div className='mr-6 font-bold leading-9 text-h3 lg:text-h2 font-inter text-000000'>
                {title}
              </div>
              {!trailAfterDropdownInMobile && trailing}
            </div>
          </div>
        </div>
        <div className='flex flex-wrap justify-end'>
          {analyticsDropdown}
          {trailAfterDropdownInMobile && trailing}
        </div>
      </div>
    </>
  )
}
