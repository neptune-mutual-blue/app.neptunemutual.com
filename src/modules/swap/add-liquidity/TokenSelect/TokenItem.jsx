import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { convertFromUnits } from '@/utils/bn'
import { useMemo } from 'react'

const TokenItem = ({ token, handleSelect }) => {
  const { balance: _balance } = useERC20Balance(token?.address)
  const balance = useMemo(
    () => convertFromUnits(_balance, token?.decimals || 0).toFixed(2).toString(),
    [_balance, token]
  )

  return (
    <button
      className='w-full py-2.5 px-4 rounded-2 hover:bg-EEEEEE'
      onClick={() => handleSelect(token)}
    >
      <div className='flex items-center justify-between gap-1'>

        <TokenAvatar className='w-8 h-8' src={token.logoSrc} verified={token.verified} />

        <div className='mr-auto'>
          <p className='text-sm font-semibold text-left'>{token.symbol}</p>
          <p className='text-xs text-left text-404040'>{token.name}</p>
        </div>

        <div>
          <p className='text-sm font-semibold text-right'>{balance}</p>
          <p className='text-xs text-right text-404040'>$12345.67</p>
        </div>
      </div>
    </button>
  )
}

export { TokenItem }
