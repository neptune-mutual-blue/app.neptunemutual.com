import {
  useMemo,
  useState
} from 'react'

import ChevronDownIcon from '@/icons/ChevronDownIcon'
import Wallet02Icon from '@/icons/Wallet02Icon'
import WarningCircleIcon from '@/icons/WarningCircleIcon'
import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { convertFromUnits } from '@/utils/bn'
import { useWeb3React } from '@web3-react/core'

export const TokenInput = ({ openSelectToken, selectedToken = null, handleInputChange = (...x) => x, isFirstToken = false }) => {
  const [inputValue, setInputValue] = useState('')
  const [dollarValue, setDollarValue] = useState('0.00')

  const { account } = useWeb3React()

  const { balance: _balance } = useERC20Balance(selectedToken?.address)
  const balance = useMemo(
    () => convertFromUnits(_balance, selectedToken?.decimals || 0).toFixed(2).toString(),
    [_balance, selectedToken]
  )

  const handleChange = (e) => {
    const value = e.target.value
    const priceInDollars = (Number(value || '0') * 1).toFixed(2)

    setInputValue(value)
    setDollarValue(priceInDollars)
    handleInputChange(value, priceInDollars, balance)
  }

  const exceedsBalance = !!(isFirstToken && selectedToken && inputValue > balance)

  return (
    <div className={`p-2.5 ${exceedsBalance ? 'bg-E52E2E-0.03 border border-E52E2E' : 'bg-f6f7f9'} rounded-big`}>
      <div className='flex items-center justify-between'>
        <input
          className='min-w-0 text-xl bg-transparent outline-none'
          type='number'
          placeholder='Enter Amount'
          value={inputValue}
          onChange={handleChange}
        />
        <button
          className='flex items-center flex-shrink-0 gap-1 p-2 text-sm font-semibold rounded-2 bg-EEEEEE'
          onClick={openSelectToken}
        >
          <TokenAvatar src={selectedToken?.logoSrc || ''} />
          {selectedToken?.symbol || 'Select Token'}
          <ChevronDownIcon className='w-4 h-4' />
        </button>
      </div>

      <div className='flex justify-between gap-1 mt-2.5'>
        {!exceedsBalance && (
          <span className='text-404040'>${dollarValue}</span>
        )}
        {exceedsBalance && (
          <span className='text-E52E2E flex items-center gap-1'>
            <WarningCircleIcon /> Exceeds Balance
          </span>
        )}
        <Wallet02Icon className='ml-auto text-4e7dd9' />
        <span className='text-4e7dd9'>
          {(account && selectedToken) ? balance : '-'}
        </span>
      </div>
    </div>
  )
}
