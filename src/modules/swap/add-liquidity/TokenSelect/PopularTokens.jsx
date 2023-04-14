import { tokens } from '@/modules/swap/add-liquidity/TokenSelect/tokens'
import { classNames } from '@/utils/classnames'
import { useMemo } from 'react'

import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { useNetwork } from '@/src/context/Network'

const PopularTokens = ({ className = '', handleSelect }) => {
  const { networkId } = useNetwork()

  const popularTokens = useMemo(() => {
    const symbols = ['WETH', 'SUSHI', 'BTC', 'USDC', 'USDT']
    const tokenList = networkId ? tokens[networkId] : tokens[1]
    return tokenList.filter(token => symbols.includes(token.symbol))
  }, [networkId])

  return (
    popularTokens.length
      ? (
        <div className={classNames('p-2.5 flex items-center gap-x-2 gap-y-2.5 flex-wrap', className)}>
          {
            popularTokens.map((token, idx) => (
              <button
                className='flex items-center gap-1 p-2 text-sm font-semibold bg-EEEEEE rounded-2'
                key={idx}
                onClick={() => handleSelect(token)}
              >
                <TokenAvatar src={token.logoSrc} />
                <span>{token.symbol}</span>
              </button>
            ))
          }
        </div>
        )
      : <></>
  )
}

export { PopularTokens }
