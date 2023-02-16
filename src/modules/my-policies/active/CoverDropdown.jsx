import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { DropdownOption } from '@/modules/reporting/DropdownOption'
import { getCoverImgSrc } from '@/src/helpers/cover'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'
import { classNames } from '@/utils/classnames'
import { Listbox, Transition } from '@headlessui/react'
import { utils } from '@neptunemutual/sdk'
import { Fragment, useEffect, useState } from 'react'

/**
 *
 * @param {Object} props
 * @param {(val: any) => any} props.onChange
 * @param {string} [props.className]
 * @param {React.ReactElement | (({selected, selectedName, selectedImg}) => React.ReactElement)} [props.renderButton]
 * @param {React.ReactElement | (({option, optionIdx, selected, active}) => React.ReactElement)} [props.renderOption]
 * @param {string} [props.buttonClass]
 * @param {string | ((active?: boolean) => string)} [props.optionClass]
 * @param {string} [props.optionsClass]
 * @returns
 */
export const CoverDropdown = ({
  onChange,
  className = '',
  buttonClass = '',
  optionClass = '',
  optionsClass = '',
  renderButton,
  renderOption
}) => {
  const { data: covers } = useFlattenedCoverProducts()

  const [selected, setSelected] = useState(null)

  useEffect(() => {
    let ignore = false

    if (!ignore && covers && covers.length > 0) {
      setSelected(covers[0])
      if (onChange) onChange(covers[0])
    }

    return () => {
      ignore = true
    }
  }, [covers, onChange])

  const { coverInfo: selectedCover } = useCoverOrProductData({
    coverKey: selected?.coverKey,
    productKey: selected?.productKey || utils.keyUtil.toBytes32('')
  })

  const selectedImageSrc = getCoverImgSrc({
    key: selectedCover?.productKey || selectedCover?.coverKey
  })

  const selectedName = selectedCover?.infoObj.coverName ||
  selectedCover?.infoObj.productName

  const handleSelect = (val) => {
    setSelected(val)
    if (onChange) onChange(val)
  }

  const Button = () => {
    if (renderButton) {
      if (typeof renderButton === 'function') {
        return renderButton({
          selected,
          selectedName,
          selectedImg: selectedImageSrc
        })
      }

      return renderButton
    }

    return (
      <>
        <div className='flex items-center truncate text-9B9B9B'>
          <div className='w-8 h-8 p-1 mr-2 rounded-full bg-DEEAF6 shrink-0'>
            <img
              src={selectedImageSrc}
              alt={selectedName}
            />
          </div>

          <span>{selectedName || 'Fetching...'}</span>
        </div>
        <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none shrink-0 text-9B9B9B'>
          <ChevronDownIcon className='w-6 h-6' aria-hidden='true' />
        </span>
      </>
    )
  }

  const Option = ({ active, option, _selected, index }) => {
    if (renderOption) {
      if (typeof renderOption === 'function') {
        return renderOption({
          selected,
          active,
          option,
          optionIdx: index
        })
      }

      return renderOption
    }

    return (
      <DropdownOption
        active={active}
        option={option}
        selected={_selected}
      />
    )
  }

  return (
    <Listbox value={selected} onChange={handleSelect}>
      <div className={classNames('relative w-full', className)}>
        <Listbox.Button
          className={classNames(
            'relative w-full py-3 pl-4 pr-12 bg-white border rounded-lg cursor-default border-B0C4DB focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9',
            buttonClass
          )}
          disabled={!selected}
        >
          <Button />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className={classNames(
            'absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none',
            optionsClass
          )}
          >
            {covers.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                id='reporting-dropdown'
                className={({ active }) =>
                  classNames(
                    'cursor-default select-none relative px-1',
                    active ? 'text-4e7dd9' : 'text-black',
                    typeof optionClass === 'function' ? optionClass(active) : optionClass
                  )}
                value={option}
              >
                {({ selected: _selected, active }) => (
                  <Option active={active} option={option} _selected={_selected} index={optionIdx} />
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
