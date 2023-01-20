import { Fragment } from 'react'

import { classNames } from '@/utils/classnames'
import {
  Listbox,
  Transition
} from '@headlessui/react'

export const Select = ({
  prefix = '',
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
      {({ open }) => (
        <div
          className={classNames('relative', className)}
          data-testid='select-container'
        >
          <Listbox.Button
            className={classNames(
              'relative w-full py-3 pl-4 bg-white border rounded-lg cursor-pointer pr-14 focus:outline-none focus-visible:border-4e7dd9',
              open ? 'border-4e7dd9' : 'border-B0C4DB'
            )}
            data-testid='select-button'
          >
            <span className='block text-left truncate text-9B9B9B'>
              {prefix}
              {selected?.name}
            </span>
            <span className='absolute inset-y-0 right-0 flex items-center pr-2 text-black pointer-events-none'>
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
                'absolute z-10 w-full py-3 mt-1 overflow-auto text-base bg-white border rounded-md shadow-dropdown md:w-auto border-B0C4DB focus:outline-none focus-visible:border-4e7dd9 max-h-60 px-3',
                direction === 'right' && 'right-0',
                loading && 'hidden'
              )}
              data-testid='options-container'
            >
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  data-testid={`option-${optionIdx + 1}`}
                  key={optionIdx}
                  className={({ active }) =>
                    classNames(
                      'cursor-default select-none relative',
                      active ? 'text-4e7dd9' : 'text-black'
                    )}
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          'block truncate px-4 py-2 capitalize rounded',
                          selected
                            ? 'bg-EEEEEE bg-opacity-50'
                            : '',
                          active ? 'bg-EEEEEE rounded-lg' : ''
                        )}
                      >
                        {option.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
