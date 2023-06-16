import {
  useEffect,
  useRef,
  useState
} from 'react'

import { useRouter } from 'next/router'

import CurrencyInput from '@/lib/react-currency-input-field'
import { classNames } from '@/utils/classnames'
import { getPlainNumber } from '@/utils/formatter/input'

/**
 *
 * @param {object} param
 * @param {React.ComponentProps<'input'> & { allowNegativeValue: boolean }} param.inputProps
 * @param {React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement> & { buttonClassName?: string }} param.buttonProps
 * @param {string} param.unit
 * @param {string} [param.unitClass]
 * @param {boolean} [param.error]
 * @param {number} param.decimalLimit
 * @returns
 */
export const InputWithTrailingButton = ({
  inputProps,
  unit,
  unitClass = '',
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

    return () => { return window.removeEventListener('resize', getSize) }
  }, [])

  useEffect(() => {
    if (inputProps.value === '') {
      setInputValue('')

      return
    }

    if (typeof inputProps.value === 'string' && inputProps.value && inputProps.value.match(/^\d+(\.\d+)?$/)) {
      setInputValue(inputProps.value)
    }
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
    <div className='relative w-full text-lg text-black'>
      <CurrencyInput
        {...inputFieldProps}
        className={classNames(
          'bg-white block w-full py-6 pl-6 pr-40 rounded-lg overflow-hidden border',
          error
            ? 'border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F'
            : 'border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4E7DD9',
          inputFieldProps.className,
          inputFieldProps.disabled && 'cursor-not-allowed'
        )}
        style={{ paddingRight: `${width || 64}px` }}
      />
      <div className='absolute inset-y-0 right-0 flex' ref={ref}>
        {unit && (
          <div className={classNames('self-center hidden px-4 whitespace-nowrap text-9B9B9B xs:block', unitClass)}>
            {unit}
          </div>
        )}
        <button
          type='button'
          className={classNames(
            'px-6 m-px font-medium uppercase tracking-wide rounded-r-mdlg bg-DAE2EB hover:bg-DEEAF6 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-4E7DD9',
            buttonClassName,
            buttonProps.disabled ? 'cursor-not-allowed' : 'hover:bg-DEEAF6'
          )}
          {...buttonProps}
        />
      </div>
    </div>
  )
}
