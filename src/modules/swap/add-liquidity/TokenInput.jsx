import ChevronDownIcon from '@/icons/ChevronDownIcon'
import Wallet02Icon from '@/icons/Wallet02Icon'
import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { convertFromUnits } from '@/utils/bn'
import { useWeb3React } from '@web3-react/core'
import { useMemo, useState } from 'react'

export const TokenInput = ({ openSelectToken, selectedToken = null, handleInputChange = (...x) => x }) => {
  const [inputValue, setInputValue] = useState('0')
  const [dollarValue, setDollarValue] = useState('0.00')

  const { account } = useWeb3React()

  const { balance: _balance } = useERC20Balance(selectedToken?.address)
  const balance = useMemo(
    () => convertFromUnits(_balance, selectedToken?.decimals || 0).toFixed(2).toString(),
    [_balance, selectedToken]
  )

  const handleChange = (e) => {
    const value = e.target.value || '0'
    const priceInDollars = (Number(value) * 1).toFixed(2)

    setInputValue(value)
    setDollarValue(priceInDollars)
    handleInputChange(value, priceInDollars, balance)
  }

  return (
    <div className='p-2.5 bg-f6f7f9 rounded-big'>
      <div className='flex items-center justify-between'>
        <input
          className='min-w-0 text-xl bg-transparent outline-none'
          type='number'
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
        <span className='text-404040'>${dollarValue}</span>
        <Wallet02Icon className='ml-auto text-4e7dd9' />
        <span className='text-4e7dd9'>
          {(account && selectedToken) ? balance : '-'}
        </span>
      </div>
    </div>
  )
}
