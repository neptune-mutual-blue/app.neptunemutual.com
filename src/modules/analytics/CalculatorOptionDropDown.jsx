import { Fragment } from 'react'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { classNames } from '@/utils/classnames'
import { utils } from '@neptunemutual/sdk'
import { Listbox, Transition } from '@headlessui/react'
import FilledDropDownIcon from '@/icons/FilledDropDownIcon'
import CheckBlue from '@/icons/CheckBlue'

export const CalculatorOptionDropDown = ({
  prefix = '',
  options,
  selected,
  setSelected,
  selectedName
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className='relative w-full'>
        <Listbox.Button className='relative w-full pt-18px pb-18px pl-18px bg-white border border-0.5 rounded-lg cursor-default border-B0C4DB focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'>
          <span className='flex items-center truncate text-01052D text-sm'>
            {prefix}
            <span className='ml-10px'>
              {selectedName}
            </span>
          </span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-5 pointer-events-none text-01052D'>
            <FilledDropDownIcon className='w-8 h-5' aria-hidden='true' />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute w-full z-30 py-1 mt-2 border border-B0C4DB shadow-lightCard overflow-auto text-base bg-white rounded-2xl shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none py-8 px-8'>
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

const DropdownOption = ({ option, selected, active }) => {
  const { coverInfo } = useCoverOrProductData({
    coverKey: option?.coverKey,
    productKey: option?.productKey || utils.keyUtil.toBytes32('')
  })

  const isDiversified = isValidProduct(option?.productKey)

  return (
    <>
      <span
        className={classNames(
          'truncate px-2 py-2 flex items-center text-sm leading-5',
          active ? 'bg-EEEEEE bg-opacity-50 rounded-lg' : ''
        )}
      >
        <div className='w-8 h-8 p-1 mr-2 rounded-full'>
          <img
            src={getCoverImgSrc({
              key: isDiversified ? option.productKey : option.coverKey
            })}
            alt={
              coverInfo?.infoObj?.coverName || coverInfo?.infoObj?.projectName || coverInfo?.infoObj?.productName
            }
          />
        </div>
        {coverInfo?.infoObj?.coverName || coverInfo?.infoObj?.projectName || coverInfo?.infoObj?.productName}
        {selected && <CheckBlue className='absolute right-2 mr-2 text-4e7dd9 h-6' />}
      </span>
      {selected && <hr className='h-px bg-B0C4DB border-0 dark:bg-B0C4DB' />}
    </>
  )
}
