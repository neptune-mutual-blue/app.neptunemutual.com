import { classNames } from '@/utils/classnames'
import { getPlainNumber } from '@/utils/formatter/input'
import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import CurrencyInput from '@/lib/react-currency-input-field'

/**
 *
 * @param {object} param
 * @param {HTMLInputElement} param.inputProps
 * @param {React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement> & { buttonClassName?: string }} param.buttonProps
 * @param {string} param.unit
 * @param {boolean} [param.error]
 * @param {number} param.decimalLimit
 * @returns
 */
export const InputWithTrailingButton = ({
  inputProps,
  unit,
  buttonProps: { buttonClassName, ...buttonProps },
  error,
  decimalLimit
}) => {
  const ref = useRef(null)
  const [width, setWidth] = useState()
  const [inputValue, setInputValue] = useState(inputProps.value ?? '')
  const { locale } = useRouter()

  const getSize = () => {
    const newWidth = ref?.current?.clientWidth
    setWidth(newWidth)
  }

  useEffect(() => {
    getSize()
  }, [unit, buttonProps.children])

  // Update 'width' when the window resizes
  useEffect(() => {
    window.addEventListener('resize', getSize)

    return () => window.removeEventListener('resize', getSize)
  }, [])

  useEffect(() => {
    if (!inputProps.value || inputProps.value.match(/^\d+(\.\d+)?$/)) { setInputValue(inputProps.value) }
  }, [inputProps.value])

  const inputFieldProps = {
    id: inputProps.id,
    placeholder: inputProps.placeholder,
    disabled: inputProps.disabled,
    intlConfig: {
      locale: locale
    },
    autoComplete: 'off',
    decimalsLimit: typeof decimalLimit === 'number' ? decimalLimit : 25,
    ...inputProps,
    onChange: null,
    value: inputValue,
    onValueChange: (val) => {
      const plainNumber = getPlainNumber(val ?? '', locale)
      if (!plainNumber.match(/^\d+\.$/)) {
        inputProps.onChange(plainNumber)
      }
      setInputValue(val)
    }
  }

  return (
    <div className='relative w-full text-black text-h4'>
      <CurrencyInput
        {...inputFieldProps}
        className={classNames(
          'bg-white block w-full py-6 pl-6 pr-40 rounded-lg overflow-hidden border',
          error
            ? 'border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F'
            : 'border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4e7dd9',
          inputFieldProps.disabled && 'cursor-not-allowed'
        )}
        style={{ paddingRight: `${width || 64}px` }}
      />
      <div className='absolute inset-y-0 right-0 flex' ref={ref}>
        {unit && (
          <div className='self-center px-4 whitespace-nowrap text-9B9B9B'>
            {unit}
          </div>
        )}
        <button
          type='button'
          className={classNames(
            'font-sora px-6 m-px font-medium  rounded-r-mdlg bg-DAE2EB hover:bg-DEEAF6 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-4e7dd9',
            buttonClassName,
            buttonProps.disabled ? 'cursor-not-allowed' : 'hover:bg-DEEAF6'
          )}
          {...buttonProps}
        />
      </div>
    </div>
  )
}
