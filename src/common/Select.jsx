import { Fragment } from 'react'

import CheckBlue from '@/icons/CheckBlue'
import { classNames } from '@/utils/classnames'
import {
  Listbox,
  Transition
} from '@headlessui/react'

export const Select = ({
  prefix = <></>,
  options,
  selected,
  setSelected,
  className = 'w-64',
  icon,
  direction = 'left',
  loading = false
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => {
        return (
          <div
            className={classNames('relative', className)}
            data-testid='select-container'
          >
            <Listbox.Button
              className={classNames(
                'relative w-full py-3 pl-4 bg-white border rounded-lg cursor-pointer pr-14 focus:outline-none focus-visible:border-4E7DD9',
                loading && 'cursor-not-allowed',
                open ? 'border-4E7DD9' : 'border-B0C4DB'
              )}
              data-testid='select-button'
            >
              <span className='block text-left truncate text-9B9B9B'>
                {prefix}
                {selected?.name}
              </span>
              <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-9B9B9B'>
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
                  'absolute z-10 w-full py-3 mt-1 overflow-auto bg-white border rounded-md shadow-dropdown md:w-auto border-B0C4DB focus:outline-none focus-visible:border-4E7DD9 max-h-60 px-3',
                  direction === 'right' && 'right-0',
                  loading && 'hidden'
                )}
                data-testid='options-container'
              >
                {options.map((option, optionIdx) => {
                  return (
                    <Listbox.Option
                      data-testid={`option-${optionIdx + 1}`}
                      key={optionIdx}
                      className={({ active }) => {
                        return classNames(
                          'cursor-default select-none relative',
                          active ? 'text-4E7DD9' : 'text-black'
                        )
                      }}
                      value={option}
                    >
                      {({ active }) => {
                        return (
                          <span
                            className={classNames(
                              'flex truncate px-4 py-2 capitalize rounded items-center justify-between',
                              selected.value === option.value
                                ? 'bg-EEEEEE bg-opacity-50'
                                : '',
                              active ? 'bg-EEEEEE rounded-lg' : ''
                            )}
                          >
                            {option.name} {selected.value === option.value && <span className='ml-8'><CheckBlue /></span>}
                          </span>
                        )
                      }}
                    </Listbox.Option>
                  )
                })}
              </Listbox.Options>
            </Transition>
          </div>
        )
      }}
    </Listbox>
  )
}
