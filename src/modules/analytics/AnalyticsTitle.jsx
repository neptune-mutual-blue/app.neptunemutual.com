import {useState} from 'react';
import { t } from '@lingui/macro'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { Select } from '@/common/Select'
import { useFetchHeroStats } from '@/src/hooks/useFetchHeroStats'
import { AnalyticsDropdown } from '@/src/modules/analytics/AnalyticsDropdown'

export const AnalyticsTitle = () =>{
  const { data: heroData } = useFetchHeroStats()
  const sortType = ''
  const setSortType = ''
  const defaultOptions = [
    { name: t`TVL Distribution`, value: 'SORT_TYPES.ALPHABETIC' },
    { name: t`Utilization ratio`, value: 'SORT_TYPES.UTILIZATION_RATIO' },
    { name: t`Liquidity`, value: 'SORT_TYPES.LIQUIDITY' }
  ]
  const [selected, setSelected] = useState(defaultOptions[0])
  return (
    <div className="flex flex-start items-center justify-between pb-16">
      <div className="flex">
        <div className="text-h1 font-semibold mr-2">
          Analytics 
        </div>
        <div className='text-sm'>
          <Select
            options={defaultOptions}
            selected={selected}
            setSelected={setSortType ?? setSelected}
            className={'block w-full border-none'}
            icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />}
            open={true}
          />
        </div>
        <div className='text-sm'>
          <AnalyticsDropdown />
        </div>
      </div>
      <div className="text-21AD8C">
        {heroData.availableCovers} covers, {heroData.reportingCovers} Reporting
      </div>
    </div>
  )
}