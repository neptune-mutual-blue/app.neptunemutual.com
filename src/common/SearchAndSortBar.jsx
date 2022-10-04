import { Select } from '@/common/Select'
import SearchIcon from '@/icons/SearchIcon'
import { classNames } from '@/utils/classnames'
import { useState } from 'react'
import { t } from '@lingui/macro'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { SORT_TYPES } from '@/utils/sorting'

export const SearchAndSortBar = ({
  containerClass = 'min-w-sm',
  searchClass = '',
  sortClass = '',
  inputClass,
  searchValue,
  onSearchChange,
  sortType,
  setSortType,
  searchAndSortOptions = null
}) => {
  const defaultOptions = [
    { name: t`A-Z`, value: SORT_TYPES.ALPHABETIC },
    { name: t`Utilization ratio`, value: SORT_TYPES.UTILIZATION_RATIO },
    { name: t`Liquidity`, value: SORT_TYPES.LIQUIDITY }
  ]

  const options = searchAndSortOptions ?? defaultOptions
  const [selected, setSelected] = useState(options[0])

  return (
    <div
      className={classNames('flex justify-between ', containerClass)}
      data-testid='search-and-sort-container'
    >
      <div
        role='search'
        className={classNames(
          'flex items-center mr-0 mb-4 md:mb-0 md:mr-2 relative',
          searchClass
        )}
      >
        <input
          className={classNames(
            'md:w-64 w-full pl-4 pr-12 py-2 border border-B0C4DB bg-white rounded-lg placeholder-9B9B9B focus:outline-none',
            inputClass
          )}
          placeholder={t`Search`}
          value={searchValue}
          onChange={onSearchChange}
          data-testid='search-input'
        />

        <div className='absolute right-3.5 flex items-center justify-center text-9B9B9B'>
          <SearchIcon width={24} height={24} data-testid='search-icon' />
        </div>
      </div>

      <Select
        prefix={t`Sort by:` + ' '}
        options={options}
        selected={sortType ?? selected}
        setSelected={setSortType ?? setSelected}
        className={sortClass}
        icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />}
      />
    </div>
  )
}
