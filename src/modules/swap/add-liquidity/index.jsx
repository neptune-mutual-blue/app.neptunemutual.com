import { useState } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import AddIcon from '@/icons/AddIcon'
import SettingsIcon from '@/icons/SettingsIcon'
import ConnectWallet
  from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import ManageLiquidity
  from '@/modules/swap/add-liquidity/ManageLiquidity/ManageLiquidity'
import MyLiquiditySelect
  from '@/modules/swap/add-liquidity/MyLiquiditySelect/MyLiquiditySelect'
import PoolShare from '@/modules/swap/add-liquidity/PoolShare/PoolShare'
import RemoveLiquidity
  from '@/modules/swap/add-liquidity/RemoveLiquidity/RemoveLiquidity'
import SupplyLiquidity
  from '@/modules/swap/add-liquidity/SupplyLiquidity/SupplyLiquidity'
import { TokenAvatar } from '@/modules/swap/add-liquidity/TokenAvatar'
import { TokenInput } from '@/modules/swap/add-liquidity/TokenInput'
import {
  TokenSelect
} from '@/modules/swap/add-liquidity/TokenSelect/TokenSelect'
import SwapContentCard from '@/modules/swap/common/SwapContentCard'
import { useNetwork } from '@/src/context/Network'
import { useWeb3React } from '@web3-react/core'

const tempLiquidity = [
  [{
    chainId: 84531,
    address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
    name: 'Fake USDC',
    symbol: 'USDC',
    decimals: 6,
    logoSrc: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    chainId: 84531,
    address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
    name: 'Fake Neptune Mutual Token',
    symbol: 'NPM',
    decimals: 18,
    logoSrc: ''
  }],
  [{
    chainId: 84531,
    address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
    name: 'Fake USDC',
    symbol: 'USDC',
    decimals: 6,
    logoSrc: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    chainId: 84531,
    address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
    name: 'Fake Neptune Mutual Token',
    symbol: 'NPM',
    decimals: 18,
    logoSrc: ''
  }],
  [{
    chainId: 84531,
    address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
    name: 'Fake USDC',
    symbol: 'USDC',
    decimals: 6,
    logoSrc: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    chainId: 84531,
    address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
    name: 'Fake Neptune Mutual Token',
    symbol: 'NPM',
    decimals: 18,
    logoSrc: ''
  }],
  [{
    chainId: 84531,
    address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
    name: 'Fake USDC',
    symbol: 'USDC',
    decimals: 6,
    logoSrc: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    chainId: 84531,
    address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
    name: 'Fake Neptune Mutual Token',
    symbol: 'NPM',
    decimals: 18,
    logoSrc: ''
  }],
  [{
    chainId: 84531,
    address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
    name: 'Fake USDC',
    symbol: 'USDC',
    decimals: 6,
    logoSrc: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    chainId: 84531,
    address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
    name: 'Fake Neptune Mutual Token',
    symbol: 'NPM',
    decimals: 18,
    logoSrc: ''
  }],
  [{
    chainId: 84531,
    address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
    name: 'Fake USDC',
    symbol: 'USDC',
    decimals: 6,
    logoSrc: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    chainId: 84531,
    address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
    name: 'Fake Neptune Mutual Token',
    symbol: 'NPM',
    decimals: 18,
    logoSrc: ''
  }],
  [{
    chainId: 84531,
    address: '0xbdCDBD278467b84F67AEE5737Ddc83A9C054cC29',
    name: 'Fake USDC',
    symbol: 'USDC',
    decimals: 6,
    logoSrc: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    chainId: 84531,
    address: '0x4BbDc138dd105C7ddE874df7FCd087b064F7973d',
    name: 'Fake Neptune Mutual Token',
    symbol: 'NPM',
    decimals: 18,
    logoSrc: ''
  }]
]

export const SwapAddLiquidity = () => {
  const [isSelectTokenOpen, setIsSelectTokenOpen] = useState(false)
  const [currentTokenSelection, setCurrentTokenSelection] = useState('token1')

  const [selectedTokens, setSelectedTokens] = useState({ token1: null, token2: null })

  const toggleSelectToken = (tokenIndex) => {
    if (tokenIndex) setCurrentTokenSelection(tokenIndex)
    setIsSelectTokenOpen(_prev => !_prev)
  }

  const handleTokenSelect = (tokenData) => {
    setSelectedTokens(_prev => ({ ..._prev, [currentTokenSelection]: tokenData }))
    setIsSelectTokenOpen(false)
  }

  const { active } = useWeb3React()
  const { networkId } = useNetwork()

  const [selectedIndex, setSelectedIndex] = useState(0)

  const [showManageLiquidity, setShowManageLiquidity] = useState(false)
  const [showAddLiquidity, setShowAddLiquidity] = useState(false)
  const [showRemoveLiquidity, setShowRemoveLiquidity] = useState(false)

  const [showApproval, setShowApproval] = useState(false)
  const [showPairDetails, setShowPairDetails] = useState(false)

  const selectedPair = tempLiquidity[selectedIndex]

  if (showAddLiquidity) {
    return (
      <SwapContentCard>
        <SupplyLiquidity
          selectedPair={selectedPair} hide={() => {
            setShowAddLiquidity(false)
          }}
        />
      </SwapContentCard>
    )
  }

  if (showRemoveLiquidity) {
    return (
      <SwapContentCard>
        <RemoveLiquidity
          selectedPair={selectedPair} hide={() => {
            setShowRemoveLiquidity(false)
          }}
        />
      </SwapContentCard>
    )
  }

  if (showManageLiquidity) {
    return (
      <SwapContentCard>
        <ManageLiquidity
          selectedPair={selectedPair} hide={() => {
            setShowManageLiquidity(false)
          }}
          onAdd={() => {
            setShowAddLiquidity(true)
          }}
          onRemove={() => {
            setShowRemoveLiquidity(true)
          }}
        />
      </SwapContentCard>
    )
  }

  return (
    <SwapContentCard>
      <div className={isSelectTokenOpen ? 'hidden' : undefined}>
        <div className='flex justify-between'>
          <h3 className='font-semibold text-display-xs'>Add Liquidity</h3>
          <button>
            <SettingsIcon />
          </button>
        </div>

        <div className='mt-6 space-y-3'>
          <TokenInput
            openSelectToken={() => toggleSelectToken('token1')}
            selectedToken={selectedTokens.token1}
          />

          <div className='relative'>
            <TokenInput
              openSelectToken={() => toggleSelectToken('token2')}
              selectedToken={selectedTokens.token2}
            />
            <div
              className='absolute flex items-center justify-center w-8 h-8 transform -translate-x-1/2 bg-white rounded-full left-1/2 -top-1/4'
            >
              <AddIcon className='w-5 h-5 text-4e7dd9' />
            </div>
          </div>

        </div>

        {showPairDetails && (
          <div className='flex flex-col items-center mt-4 gap-4'>
            <div className='text-sm'><span className='font-semibold'>1 {selectedTokens.token1.symbol} = 12807.8 {selectedTokens.token2.symbol}</span> ($0.28)</div>
            <div className='flex items-center'>
              <TokenAvatar className='h-8 w-8' src={selectedTokens.token1.logoSrc} verified={selectedTokens.token1.verified} />
              <svg width='34' height='2' viewBox='0 0 34 2' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M0 1H34' stroke='#01052D' strokeDasharray='2 2' />
              </svg>
              <TokenAvatar className='h-8 w-8' src={selectedTokens.token1.logoSrc} verified={selectedTokens.token1.verified} />
            </div>
          </div>
        )}

        <ConnectWallet networkId={networkId} notifier={console.log}>
          {({ onOpen }) => {
            return (
              <RegularButton
                onClick={() => {
                  if (!active) {
                    onOpen()
                    return
                  }

                  if (!showApproval && selectedTokens.token1 && selectedTokens.token2) {
                    setShowApproval(true)
                    setShowPairDetails(true)
                  }
                }} className='w-full py-4 mt-4 font-semibold rounded-big'
              >
                {active ? showApproval ? 'Approve' : 'CREATE POOL' : 'Connect Wallet'}
              </RegularButton>
            )
          }}
        </ConnectWallet>

        {selectedTokens.token1 && selectedTokens.token2 && (
          <PoolShare selectedPair={[selectedTokens.token1, selectedTokens.token2]} />
        )}

        <div className='flex items-center gap-2 mt-4'>

          <h3 className='text-display-xs font-semibold'>Your Liquidity</h3>
          {tempLiquidity.length > 0 && (

            <div className='text-xs font-medium py-0.5 px-2 rounded-1.5 bg-4e7dd9 text-white'>
              {tempLiquidity.length}
            </div>
          )}
        </div>

        {!active && (
          <div className='p-4 mt-4 text-center rounded-big bg-F3F5F7 text-404040'>
            No Liquidity Found
          </div>
        )}

        {active && (
          <MyLiquiditySelect
            liquidityPairs={tempLiquidity}
            onSelectionChange={(index) => {
              setSelectedIndex(index)
              setShowManageLiquidity(true)
            }}
          />
        )}
      </div>

      <TokenSelect
        show={isSelectTokenOpen}
        toggleSelectToken={toggleSelectToken}
        handleTokenSelect={handleTokenSelect}
      />

    </SwapContentCard>

  )
}
