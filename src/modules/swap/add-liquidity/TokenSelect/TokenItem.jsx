import { useMemo } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { convertFromUnits } from '@/utils/bn'

const TokenItem = ({ token, handleSelect, ...rest }) => {
  const { showImport, onImport } = rest

  const { balance: _balance } = useERC20Balance(token?.address)
  const balance = useMemo(
    () => convertFromUnits(_balance, token?.decimals || 0).toFixed(2).toString(),
    [_balance, token]
  )

  const component = (children) => {
    if (showImport) {
      return (
        <div className='w-full py-2.5 px-4 rounded-2 hover:bg-EEEEEE'>
          {children}
        </div>
      )
    } else {
      return (
        <button
          className='w-full py-2.5 px-4 rounded-2 hover:bg-EEEEEE'
          onClick={() => !showImport && handleSelect(token)}
        >
          {children}
        </button>
      )
    }
  }

  return component(
    <div className='flex items-center justify-between gap-1'>

      <TokenAvatar className='w-8 h-8' src={token.logoSrc} verified={token.verified} />

      <div className='mr-auto'>
        <p className='text-sm font-semibold text-left'>{token.symbol}</p>
        <p className='text-xs text-left text-404040'>{token.name}</p>
      </div>

      {showImport && (
        <RegularButton className='text-xs leading-6 py-1 px-2' onClick={onImport}>Import</RegularButton>
      )}

      {!showImport && (
        <div>
          <p className='text-sm font-semibold text-right'>{balance}</p>
          <p className='text-xs text-right text-404040'>$12345.67</p>
        </div>
      )}

    </div>
  )
}

export { TokenItem }
