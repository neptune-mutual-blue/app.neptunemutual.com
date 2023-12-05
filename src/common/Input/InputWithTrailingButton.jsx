import {
  useCallback,
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
 * @param {React.ComponentProps<'input'> & { allowNegativeValue?: boolean, decimalsLimit?: number }} param.inputProps
 * @param {React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement> & { buttonClassName?: string }} param.buttonProps
 * @param {string} param.unit
 * @param {string} [param.unitClass]
 * @param {boolean} [param.error]
 * @returns
 */
export const InputWithTrailingButton = ({
  inputProps,
  unit,
  unitClass = '',
  buttonProps: { buttonClassName, ...buttonProps },
  error
}) => {
  const ref = useRef(null)
  const [width, setWidth] = useState()
  // state for storing the value of `CurrencyInput` since only plain number is stored in `inputProps.value`
  const [inputValue, setInputValue] = useState(inputProps.value ?? '')
  const { locale } = useRouter()

  // callback function to get width of the unit & max button, and update `width` state
  const getSize = useCallback(() => {
    const newWidth = ref?.current?.clientWidth
    setWidth(newWidth)
  }, [ref])

  useEffect(() => {
    getSize()
  }, [unit, buttonProps.children, getSize])

  useEffect(() => {
    window.addEventListener('resize', getSize)

    return () => { return window.removeEventListener('resize', getSize) }
  }, [getSize])

  useEffect(() => {
    if (inputProps.value === '') {
      setInputValue('')

      return
    }

    // only update `inputValue` if `inputProps.value` prop is a valid numeric string i.e `43` or `546.43`
    if (typeof inputProps.value === 'string' && inputProps.value.match(/^\d+(\.\d+)?$/)) {
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
    ...inputProps,
    decimalsLimit: inputProps.decimalsLimit || 25,
    onChange: null,
    value: inputValue,
    // change handler function passed as prop to the `CurrencyInput` component
    onValueChange: (val) => {
      // get plain number from formatted numbers i.e 5,200.43 --> 5200.43
      const plainNumber = getPlainNumber(val ?? '', locale)

      // pass plain number to `inputProps`'s `onChange` handler if it doesn't end in a dot(`.`)
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
