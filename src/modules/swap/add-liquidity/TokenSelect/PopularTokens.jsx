import { classNames } from '@/utils/classnames'
import { useMemo } from 'react'

import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { useNetwork } from '@/src/context/Network'

const POPULAR_TOKENS = [
  'WETH', 'SUSHI', 'BTC', 'USDC', 'USDT', 'NPM'
]

const PopularTokens = ({ tokens, className = '', handleSelect }) => {
  const { networkId } = useNetwork()

  const popularTokens = useMemo(() => {
    if (!tokens) return []

    const tokenList = networkId ? tokens[networkId] : tokens[1]
    return tokenList.filter(token => POPULAR_TOKENS.includes(token.symbol))
  }, [networkId, tokens])

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
