import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { classNames } from '@/utils/classnames'
import { DropdownOption } from '@/modules/reporting/DropdownOption'

export const ReportingDropdown = ({
  prefix = '',
  options,
  selected,
  setSelected,
  selectedName
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative w-full'>
        <Listbox.Button className='relative w-full py-3 pl-4 pr-12 bg-white border rounded-lg cursor-default border-B0C4DB focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'>
          <span className='flex items-center truncate text-9B9B9B'>
            {prefix}
            {selectedName}
          </span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-9B9B9B'>
            <ChevronDownIcon className='w-6 h-6' aria-hidden='true' />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none'>
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                id='reporting-dropdown'
                className={({ active }) =>
                  classNames(
                    'cursor-default select-none relative px-1',
                    active ? 'text-4e7dd9' : 'text-black'
                  )}
                value={option}
              >
                {({ selected: _selected, active }) => (
                  <DropdownOption
                    active={active}
                    option={option}
                    selected={_selected}
                  />
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
