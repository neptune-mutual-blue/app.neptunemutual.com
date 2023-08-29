import {
  useMemo,
  useState
} from 'react'

import { useRouter } from 'next/router'

import CurrencyInput from '@/lib/react-currency-input-field'
import {
  convertFromUnits,
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { getPlainNumber } from '@/utils/formatter/input'
import { TokenOrCoverLogo } from '@/modules/bridge/bridge-form/TokenOrCoverLogo'
import { NPMSwapLink } from '@/common/TokenBalance'
import { useAppConstants } from '@/src/context/AppConstants'

export const TransferAmountInput = ({
  balance,
  tokenDecimals,
  tokenSymbol,
  onChange,
  value,
  className = ''
}) => {
  const { locale } = useRouter()
  const formattedBalance = formatCurrency(
    convertFromUnits(balance, tokenDecimals),
    locale,
    tokenSymbol,
    true
  )

  const { NPMTokenAddress } = useAppConstants()

  const [inputValue, setInputValue] = useState(value ?? '')

  const error = useMemo(() => {
    if (toBNSafe(convertToUnits(value, tokenDecimals)).isGreaterThan(balance)) {
      return { message: 'Exceeds Balance' }
    }

    return { message: '' }
  }, [value, balance, tokenDecimals])

  const onValueChange = (val) => {
    const plainNumber = getPlainNumber(val ?? '', locale)
    if (!plainNumber.match(/^\d+\.$/)) {
      onChange(plainNumber)
    }
    setInputValue(val)
  }

  const inputFieldProps = {
    placeholder: '0.0',
    intlConfig: {
      locale: locale
    },
    autoComplete: 'off',
    decimalsLimit: 25,
    onChange: null,
    value: inputValue,
    onValueChange
  }

  return (
    <div
      className={classNames(
        'p-2.5 rounded-big bg-F6F7F9 border border-transparent input-container-focus',
        error.message && 'border-E52E2E bg-E52E2E bg-opacity-5',
        className
      )}
    >
      <div className='flex gap-1'>
        <CurrencyInput
          className='flex-grow bg-transparent outline-none text-display-xs min-w-120'
          {...inputFieldProps}
        />
        <button
          className='px-1 text-sm font-semibold cursor-pointer'
          onClick={() => { return onValueChange(convertFromUnits(balance, tokenDecimals).toString()) }}
        >
          MAX
        </button>
      </div>

      {error.message && (
        <p className='text-sm text-E52E2E mt-2.5'>{error.message}</p>
      )}

      <div className='flex items-center gap-1 text-sm font-semibold w-max mt-2.5'>
        <TokenOrCoverLogo
          src='/images/tokens/npm.svg'
          alt='NPM logo'
        />
        <p>{tokenSymbol} Token</p>
        <p className='text-4E7DD9' title={formattedBalance.long}>
          Balance: {formattedBalance.short}
        </p>

        <NPMSwapLink tokenAddress={NPMTokenAddress} className='text-xs' />
      </div>
    </div>
  )
}
