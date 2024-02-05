import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { Select } from '@/common/Select'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import SearchIcon from '@/icons/SearchIcon'
import { classNames } from '@/utils/classnames'
import { DEFAULT_SORT_OPTIONS } from '@/utils/sorting'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const SearchAndSortBar = ({
  containerClass = 'min-w-sm',
  searchClass = '',
  sortClass = '',
  reportingResolved = false,
  inputClass = '',
  searchValue,
  onSearchChange,
  sortType,
  setSortType,
  optionsProp = null,
  loading = false
}) => {
  const { i18n } = useLingui()

  const options = useMemo(() => {
    return optionsProp ?? DEFAULT_SORT_OPTIONS(i18n)
  }, [i18n, optionsProp])

  const [selected, setSelected] = useState(options[0])

  useEffect(() => {
    setSelected(prev => {
      const exist = options.find(o => {
        return o.name === prev.name && o.value === prev.value
      })

      if (!exist) {
        return options[0]
      }

      return prev
    })
  }, [options])

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
          autoComplete='off'
          className={classNames(
            'w-full pr-12 py-3 border border-B0C4DB bg-white rounded-lg placeholder-9B9B9B focus:outline-none',
            inputClass, reportingResolved ? 'pl-12' : 'pl-4'
          )}
          placeholder={t(i18n)`Search`}
          value={searchValue}
          onChange={onSearchChange}
          data-testid='search-input'
          disabled={loading}
        />

        <div className={classNames('absolute flex items-center justify-center text-9B9B9B', reportingResolved ? 'left-3.5' : 'right-3.5')}>
          <SearchIcon width={24} height={24} data-testid='search-icon' />
        </div>
      </div>

      <Select
        loading={loading}
        prefix={<><Trans>Sort by:</Trans>{' '}</>}
        options={options}
        selected={sortType ?? selected}
        setSelected={setSortType ?? setSelected}
        className={sortClass}
        direction='right'
        icon={<ChevronDownIcon className='w-6 h-6' aria-hidden='true' />}
      />
    </div>
  )
}
