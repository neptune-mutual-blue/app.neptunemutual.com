import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useFlattenedCoverProducts } from '@/src/hooks/useFlattenedCoverProducts'
import { classNames } from '@/utils/classnames'
import { Listbox, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from 'react'
import { CoverDropdownOption } from '@/common/CoverDropdown/CoverDropdownOption'

import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import { useNetwork } from '@/src/context/Network'
import { sorter, SORT_DATA_TYPES } from '@/utils/sorting'

/**
 *
 * @param {Object} props
 * @param {(selected: any) => any} props.onChange
 * @param {string} [props.className]
 * @param {React.ReactElement | (({selected, name, image}) => React.ReactElement)} [props.renderButton]
 * @param {React.ReactElement | (({name, image, option, optionIdx, selected, active}) => React.ReactElement)} [props.renderOption]
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
  const { data: flattenedCovers } = useFlattenedCoverProducts()

  const [selected, setSelected] = useState(null)
  const [covers, setCovers] = useState([])

  const { networkId } = useNetwork()
  const { getCoverOrProductData } = useCoversAndProducts()

  useEffect(() => {
    let ignore = false

    if (ignore || !flattenedCovers || !flattenedCovers.length || !networkId) return

    flattenedCovers.forEach((cover) => {
      const coverKey = cover?.coverKey
      const productKey = cover?.productKey

      if (!coverKey || !productKey) return
      getCoverOrProductData({ coverKey, productKey, networkId })
        .then((data) => {
          if (ignore || !data) return
          setCovers(prev => {
            const sorted = sorter({
              datatype: SORT_DATA_TYPES.STRING,
              list: [...prev, data],
              selector: (cover) => cover?.infoObj.coverName || cover?.infoObj.productName
            })

            return [...sorted]
          })
        })
        // .catch(console.error)
    })

    return () => {
      ignore = true
    }
  }, [flattenedCovers, getCoverOrProductData, networkId])

  useEffect(() => {
    let ignore = false

    if (!ignore && covers.length) {
      setSelected(covers[0])
      if (onChange) onChange(covers[0])
    }

    return () => {
      ignore = true
    }
  }, [covers, onChange])

  const selectedName = selected?.infoObj.coverName ||
  selected?.infoObj.productName

  const selectedImageSrc = getCoverImgSrc({
    key: selected?.productKey || selected?.coverKey
  })

  const handleSelect = (val) => {
    setSelected(val)
    if (onChange) onChange(val)
  }

  const Button = () => {
    if (renderButton) {
      if (typeof renderButton === 'function') {
        return renderButton({
          selected,
          name: selectedName,
          image: selectedImageSrc
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
    const name = option?.infoObj?.coverName || option?.infoObj?.projectName || option?.infoObj?.productName
    const image = getCoverImgSrc({
      key: isDiversified ? option.productKey : option.coverKey
    })

    if (renderOption) {
      if (typeof renderOption === 'function') {
        return renderOption({
          name,
          image,
          selected,
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

  return (
    <Listbox value={selected} onChange={handleSelect}>
      <div className={classNames('relative w-full', className)}>
        <Listbox.Button
          className={classNames(
            'relative w-full py-3 pl-4 pr-12 bg-white border rounded-lg border-B0C4DB focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9 cursor-pointer disabled:cursor-not-allowed',
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
                    'select-none relative px-1 cursor-pointer disabled:cursor-not-allowed',
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
