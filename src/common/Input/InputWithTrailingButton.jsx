import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { useRouter } from 'next/router'

import CurrencyInput from '@/lib/react-currency-input-field'
import { classNames } from '@/utils/classnames'

/**
 *
 * @param {object} param
 * @param {React.ComponentProps<'input'> & { allowNegativeValue: boolean }} param.inputProps
 * @param {React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement> & { buttonClassName?: string }} param.buttonProps
 * @param {string} param.unit
 * @param {string} [param.unitClass]
 * @param {boolean} [param.error]
 * @param {number} param.decimalLimit
 * @param {boolean} param.disabled
 * @returns
 */
export const InputWithTrailingButton = ({
  inputProps,
  unit,
  unitClass = '',
  buttonProps: { buttonClassName, ...buttonProps },
  error,
  decimalLimit,
  disabled
}) => {
  const ref = useRef(null)
  const [width, setWidth] = useState()

  const { locale } = useRouter()

  // callback function to get width of the unit & max button, and update `width` state
  const getSize = useCallback(() => {
    const newWidth = ref?.current?.clientWidth
    setWidth(newWidth)
  }, [])

  useEffect(() => {
    getSize()
  }, [unit, buttonProps.children, getSize])

  // Update 'width' when the window resizes
  useEffect(() => {
    window.addEventListener('resize', getSize)

    return () => { return window.removeEventListener('resize', getSize) }
  }, [getSize])

  const inputFieldProps = {
    id: inputProps.id,
    placeholder: inputProps.placeholder,
    intlConfig: {
      locale: locale
    },
    autoComplete: 'off',
    decimalsLimit: typeof decimalLimit === 'number' ? decimalLimit : 25,
    ...inputProps,
    disabled: inputProps.disabled || disabled,
    onChange: null,
    value: inputProps.value,
    onValueChange: (value, name, values) => {
      inputProps.onChange(values.value)
    }
  }

  return (
    <div className={classNames('relative w-full text-lg text-black', disabled && 'opacity-40 cursor-not-allowed')}>
      <CurrencyInput
        disableAbbreviations
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
            (buttonProps.disabled || disabled) ? 'cursor-not-allowed' : 'hover:bg-DEEAF6'
          )}
          {...buttonProps}
          disabled={buttonProps.disabled || disabled}
        />
      </div>
    </div>
  )
}
