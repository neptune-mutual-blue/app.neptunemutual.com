import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import CheckBlue from '@/icons/CheckBlue'
import { classNames } from '@/utils/classnames'

const DROPDOWN_OPTIONS = [
  { label: 'Quick Info', value: 'Quick Info', type: 'option' },
  { label: 'Growth', value: 'Growth', type: 'label' },
  { label: 'Demand', value: 'Demand', type: 'option' },
  { label: 'Cover TVL', value: 'Cover TVL', type: 'option' },
  { label: 'Pool TVL', value: 'Pool TVL', type: 'option' },
  { label: 'Other Insights', value: 'Other Insights', type: 'label' },
  { label: 'Top Accounts', value: 'Top Accounts', type: 'option' },
  { label: 'Premium Earned', value: 'Premium Earned', type: 'option' },
  { label: 'Cover Earnings', value: 'Cover Earnings', type: 'option' },
  { label: 'In Consensus', value: 'In Consensus', type: 'option' }
]

export const AnalyticsDropdown = ({
  options = DROPDOWN_OPTIONS,
  icon,
  direction = 'right',
  loading = false
}) => {
  const [selected, setSelected] = useState(DROPDOWN_OPTIONS[0])
  console.log(selected, ' -- deseld')
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div
        className='relative w-full'
      >
        <Listbox.Button
          className={classNames(
            'relative w-full py-3 pl-4 bg-f6f7f9 border rounded-lg cursor-pointer pr-14 focus:outline-none focus-visible:border-4e7dd9',
            loading && 'cursor-not-allowed',
            'border-none'
          )}
          data-testid='select-button'
        >
          <span className='block text-left truncate text-9B9B9B'>
            {selected?.label}
          </span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-2 text-9B9B9B pointer-events-none'>
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
              'absolute z-10 w-full mt-3 overflow-auto text-base bg-white border rounded-md shadow-dropdown md:w-auto border-B0C4DB focus:outline-none focus-visible:border-4e7dd9 p-6 ',
              direction === 'right' && 'right-0',
              loading && 'hidden'
            )}
            data-testid='options-container'
          >
            {options.map((option, optionIdx) => (
              <Fragment key={optionIdx}>
                {option.type === 'label'
                  ? <> <hr className='h-px bg-B0C4DB border-0 dark:bg-B0C4DB' /> <Listbox.Label className='block font-semibold pl-2 pt-4 pb-2'>{option.label}</Listbox.Label></>
                  : <ListChoice optionIdx={optionIdx} option={option} selected={selected} />}
              </Fragment>
            ))}
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
      className={({ active }) =>
        classNames(
          'cursor-default select-none relative pb-2',
          active ? 'text-4e7dd9' : 'text-black'
        )}
      value={option}
    >
      {({ active }) => {
        return (
          <span
            className={classNames(
              'flex truncate pl-2 pr-16 py-2 capitalize rounded items-center justify-between',
              active ? 'bg-EEEEEE rounded-lg' : ''
            )}
          >
            {option.label} {selected.value === option.value && <CheckBlue className='absolute right-2 text-4e7dd9 h-6' />}
          </span>
        )
      }}
    </Listbox.Option>
  )
}
