import {
  useEffect,
  useRef,
  useState
} from 'react'

import CurrencyInput from '@/lib/react-currency-input-field'
import { useLanguageContext } from '@/src/i18n/i18n'
import { classNames } from '@/utils/classnames'

/**
 *
 * @param {object} param
 * @param {import('@/lib/react-currency-input-field').CurrencyInputProps} param.inputProps
 * @param {React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement> & { buttonClassName?: string }} param.buttonProps
 * @param {string} param.unit
 * @param {string} [param.unitClass]
 * @param {string} [param.error]
 * @param {number} [param.decimalLimit]
 * @returns
 */
export const CalculatorAmountHandler = ({
  inputProps,
  unit,
  unitClass = '',
  buttonProps: { buttonClassName, ...buttonProps },
  error,
  decimalLimit
}) => {
  const ref = useRef(null)
  const [width, setWidth] = useState()
  const [focus, setFocus] = useState(false)
  const { locale } = useLanguageContext()

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
    value: inputProps.value ?? '',
    onValueChange: (value, name, values) => {
      inputProps.onChange(values.value)
    }
  }

  return (
    <div className='relative w-full text-lg text-black'>
      <div className='relative w-full'>
        <CurrencyInput
          disableAbbreviations
          {...inputFieldProps}
          className={classNames(
            'bg-white block w-full py-5 pl-4 rounded-lg overflow-hidden border text-9B9B9B font-normal text-sm',
            error
              ? 'border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F'
              : 'border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4E7DD9 border-0.5',
            inputFieldProps.className,
            inputFieldProps.disabled && 'cursor-not-allowed',
            focus || inputProps.value ? 'text-01052D' : '9B9B9B'
          )}
          style={{ paddingRight: `${width || 64}px` }}
          onFocus={() => { return setFocus(true) }}
          onBlur={() => { return setFocus(false) }}
        />
        <div className='absolute inset-y-0 right-0 flex px-0 py-0 mx-0 my-0' ref={ref}>
          {unit && (
            <div className={classNames('self-center hidden px-4 whitespace-nowrap text-9B9B9B text-sm font-normal xs:block', unitClass)}>
              {unit}
            </div>
          )}
          <button
            type='button'
            className={classNames(
              'border-B0C4DB border-0.5 px-6 m-px font-normal uppercase tracking-wide rounded-r-mdlg hover:bg-DEEAF6 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-4E7DD9',
              buttonClassName,
              buttonProps.disabled ? 'cursor-not-allowed' : 'hover:bg-DEEAF6'
            )}
            {...buttonProps}
          />
        </div>
      </div>

      {error && (
        <p className='mt-1 text-sm text-FA5C2F'>
          {error}
        </p>
      )}
    </div>
  )
}
