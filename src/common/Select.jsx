import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { classNames } from '@/utils/classnames'

export const Select = ({
  prefix = '',
  options,
  selected,
  setSelected,
  className = 'w-64',
  icon,
  direction = 'left'
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
              'relative w-full py-2 pl-4 bg-white border rounded-lg cursor-default pr-14  focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9',
              open ? 'border-4e7dd9' : 'border-B0C4DB'
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
                'absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white border rounded-md shadow-lg md:w-auto border-B0C4DB max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none',
                direction === 'right' && 'right-0'
              )}
              data-testid='options-container'
            >
              {options.map((option, optionIdx) => (
                <Listbox.Option
                  data-testid={`option-${optionIdx + 1}`}
                  key={optionIdx}
                  className={({ active }) =>
                    classNames(
                      'cursor-default select-none relative px-1',
                      active ? 'text-4e7dd9' : 'text-black'
                    )}
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={classNames(
                          'block truncate px-4 py-2 capitalize',
                          selected ? 'font-medium' : 'font-normal',
                          active ? 'bg-EEEEEE bg-opacity-50 rounded-lg' : ''
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
