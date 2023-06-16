import {
  Fragment,
  useState
} from 'react'

import CheckBlue from '@/icons/CheckBlue'
import SearchIcon from '@/icons/SearchIcon'
import { classNames } from '@/utils/classnames'
import {
  Listbox,
  Transition
} from '@headlessui/react'

export const InsightsDropdown = ({
  options,
  icon,
  loading = false,
  selected,
  setSelected
}) => {
  const [search, setSearch] = useState('')

  const filteredOptions = search ? options.filter((option) => { return option.type !== 'label' && option.label.toLowerCase().includes(search.toLowerCase()) }) : options

  return (
    <Listbox
      value={selected} onChange={(value) => {
        setSearch('')
        setSelected(value)
      }}
    >
      <div
        className='relative w-full'
      >
        <Listbox.Button
          className={classNames(
            'flex items-center gap-2 w-full md:w-max py-2 px-4 bg-F6F7F9 rounded-lg cursor-pointer focus:outline-none  justify-between',
            loading && 'cursor-not-allowed'
          )}
          data-testid='select-button'
        >
          <span className='block text-xs font-normal text-left truncate lg:text-center text-000000'>
            {selected?.label}
          </span>
          <span className='flex items-center text-xs pointer-events-none text-000000'>
            {icon}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options
            className={classNames(
              'absolute z-30 w-full md:w-324 mt-2 overflow-auto text-base bg-white border shadow-lightCard border-D6D6D6 focus:outline-none focus-visible:border-4E7DD9 rounded-2xl left-0',
              loading && 'hidden'
            )}
            data-testid='options-container'
          >
            <div className='px-6 py-4 mb-0 border-b-1 border-D6D6D6'>
              <div className='relative'>

                <input
                  value={search} onChange={(e) => {
                    setSearch(e.target.value)
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                  }}
                  onBlurCapture={(e) => {
                    if (e.relatedTarget?.id.includes('headlessui-listbox')) {
                      setTimeout(() => {
                        e.target.focus()
                      }, 0)
                    }
                  }}
                  placeholder='Search' className='w-full px-4 py-2 leading-5 border-1 rounded-2 border-D6D6D6' type='text'
                />
                <div className='absolute top-2.5 right-4'>
                  <SearchIcon className='w-4 h-4' />
                </div>
              </div>

            </div>

            <div className='overflow-auto h-435'>
              {filteredOptions.length === 0 && <div className='py-2.5 px-6 italic'>No items found</div>}
              {filteredOptions.map((option, optionIdx) => {
                return (
                  <Fragment key={optionIdx}>
                    {option.type === 'label'
                      ? <> <hr className='h-px border-0 bg-D6D6D6 ' /> <Listbox.Label className='block py-2.5 px-6 text-sm font-semibold leading-5 text-000000'>{option.label}</Listbox.Label></>
                      : <ListChoice optionIdx={optionIdx} option={option} selected={selected} />}
                  </Fragment>
                )
              })}
            </div>

          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

const ListChoice = ({ optionIdx, option, selected }) => {
  return (
    <Listbox.Option
      data-testid={`option-${optionIdx + 1}`}
      className={({ active }) => {
        return classNames(
          'cursor-default select-none relative w-full overflow-hidden',
          active ? 'text-4E7DD9' : 'text-black'
        )
      }}
      value={option}
    >
      {({ active }) => {
        return (
          <span
            className={classNames(
              'flex truncate gap-2 py-2.5 px-6 capitalize rounded items-center justify-between leading-5 font-normal text-sm text-000000',
              active ? 'bg-EEEEEE rounded-lg' : ''
            )}
          >
            <span className='truncate whitespace-normal max-h-10'>{option.label}</span>
            {selected.value === option.value && <CheckBlue className='w-4 h-4 shrink-0 text-4E7DD9' />}
          </span>
        )
      }}
    </Listbox.Option>
  )
}
