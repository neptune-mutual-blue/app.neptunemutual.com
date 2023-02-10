import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { useFetchHeroStats } from '@/src/hooks/useFetchHeroStats'
import { AnalyticsDropdown } from '@/src/modules/analytics/AnalyticsDropdown'

export const AnalyticsTitle = () => {
  const { data: heroData } = useFetchHeroStats()

  return (
    <div className='flex flex-start items-center justify-between pb-16'>
      <div className='flex'>
        <div className='text-h1 font-sora font-bold mr-8'>
          Analytics
        </div>

        <div className='text-sm'>
          <AnalyticsDropdown icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />} />
        </div>
      </div>
      <div className='text-21AD8C'>
        {heroData.availableCovers} covers, {heroData.reportingCovers} Reporting
      </div>
    </div>
  )
}
