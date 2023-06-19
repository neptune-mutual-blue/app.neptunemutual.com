import { Fragment } from 'react'

import { CoverDropdownOption } from '@/common/CoverDropdown/CoverDropdownOption'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { classNames } from '@/utils/classnames'
import {
  Listbox,
  Transition
} from '@headlessui/react'
import { Trans } from '@lingui/macro'

/**
 *
 * @param {Object} props
 * @param {any} props.selected
 * @param {boolean} props.loading
 * @param {any[]} props.covers
 * @param {(selected: any) => any} props.setSelected
 * @param {string} [props.className]
 * @param {React.ReactElement | (({selected, name, image, open}) => React.ReactElement)} [props.renderButton]
 * @param {React.ReactElement | (({name, image, option, optionIdx, isSelected, active}) => React.ReactElement)} [props.renderOption]
 * @param {string} [props.buttonClass]
 * @param {string | ((active?: boolean) => string)} [props.optionClass]
 * @param {string} [props.optionsClass]
 * @returns
 */
export const CoverDropdown = ({
  selected,
  setSelected,
  covers,
  loading,
  className = '',
  buttonClass = '',
  optionClass = '',
  optionsClass = '',
  renderButton,
  renderOption
}) => {
  const isDiversified = isValidProduct(selected?.productKey)
  const selectedName = isDiversified
    ? selected?.productInfoDetails.productName
    : selected?.coverInfoDetails.coverName || selected?.coverInfoDetails.projectName

  const selectedImageSrc = getCoverImgSrc({
    key: isValidProduct(selected?.productKey) ? selected?.productKey : selected?.coverKey
  })

  const handleSelect = (val) => {
    setSelected(val)
  }

  const Button = ({ open }) => {
    if (renderButton) {
      if (typeof renderButton === 'function') {
        return renderButton({
          selected,
          name: selectedName,
          image: selectedImageSrc,
          open
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
    const isDiversified = isValidProduct(option?.productKey)
    const name = isDiversified
      ? option?.productInfoDetails.productName
      : option?.coverInfoDetails.coverName || option?.coverInfoDetails.projectName
    const image = getCoverImgSrc({
      key: isDiversified ? option.productKey : option.coverKey
    })

    if (renderOption) {
      if (typeof renderOption === 'function') {
        return renderOption({
          name,
          image,
          isSelected: _selected,
          active,
          option,
          optionIdx: index
        })
      }

      return renderOption
    }

    return (
      <CoverDropdownOption
        name={name}
        image={image}
        active={active}
        selected={_selected}
      />
    )
  }

  if (loading) {
    return <p><Trans>loading...</Trans></p>
  }

  return (
    <Listbox value={selected} onChange={handleSelect}>
      <div className={classNames('relative w-full', className)}>
        <Listbox.Button
          className={classNames(
            'relative w-full py-3 pl-4 pr-12 bg-white border rounded-lg border-B0C4DB focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9 cursor-pointer disabled:cursor-not-allowed',
            buttonClass
          )}
          disabled={!selected}
        >
          {({ open }) => {
            return (
              <Button open={open} />
            )
          }}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className={classNames(
            'absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-80 ring-1 ring-black ring-opacity-5 focus:outline-none border shadow-lg border-B0C4DB',
            optionsClass
          )}
          >

            {covers.map((option, optionIdx) => {
              return (
                <Listbox.Option
                  key={optionIdx}
                  id='reporting-dropdown'
                  className={({ active }) => {
                    return classNames(
                      'select-none relative px-1 cursor-pointer disabled:cursor-not-allowed',
                      active ? 'text-4E7DD9' : 'text-black',
                      typeof optionClass === 'function' ? optionClass(active) : optionClass
                    )
                  }}
                  value={option}
                >
                  {({ selected: _selected, active }) => {
                    return (
                      <Option active={active} option={option} _selected={_selected} index={optionIdx} />
                    )
                  }}
                </Listbox.Option>
              )
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
