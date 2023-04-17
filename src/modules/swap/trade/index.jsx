import { useState } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import ArrowDown from '@/icons/ArrowDown'
import SettingsIcon from '@/icons/SettingsIcon'
import SwapTrendupIcon from '@/icons/SwapTrendUpIcon'
import ConnectWallet
  from '@/lib/connect-wallet/components/ConnectWallet/ConnectWallet'
import { TokenInput } from '@/modules/swap/add-liquidity/TokenInput'
import {
  TokenSelect
} from '@/modules/swap/add-liquidity/TokenSelect/TokenSelect'
import SwapContentCard from '@/modules/swap/common/SwapContentCard'
import { TradeSettings } from '@/modules/swap/trade/Settings/TradeSettings'
import { useNetwork } from '@/src/context/Network'
import { useWeb3React } from '@web3-react/core'

const highPriceImpact = 5
const tooHighPriceImpact = 15

const TradeView = () => {
  const { active } = useWeb3React()
  const { networkId } = useNetwork()

  const [isSelectTokenOpen, setIsSelectTokenOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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

  const priceImpact = -15.98

  const absolutePriceImpact = Math.abs(priceImpact)

  const hasHighPriceImpact = absolutePriceImpact > highPriceImpact
  const hasTooHighPriceImpact = absolutePriceImpact > tooHighPriceImpact

  return (
    <SwapContentCard>
      <div className={(isSelectTokenOpen || isSettingsOpen) ? 'hidden' : undefined}>

        <div className='flex justify-between items-center'>
          <h3 className='font-semibold text-display-xs'>Trade</h3>
          <button onClick={() => {
            setIsSettingsOpen(true)
          }}
          >
            <SettingsIcon />
          </button>
        </div>
        {active && (
          <div className='flex gap-1 items-center mt-1'>
            <SwapTrendupIcon />
            <div className='text-xs'><span className='font-semibold'>1 SUSHI</span> ($1.13294) = <span className='font-semibold'>0.0006054 ETH</span> ($1871.53)</div>
          </div>
        )}

        <div className='mt-6 space-y-3'>
          <TokenInput
            isFirstToken
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
              <ArrowDown className='w-5 h-5 text-4e7dd9' />
            </div>
          </div>

        </div>
        {/* <div className='mt-6 mb-4'>
          <TokenPairSelector />
        </div> */}
        <ConnectWallet networkId={networkId} notifier={console.log}>
          {({ onOpen }) => {
            return (
              <RegularButton
                onClick={() => {
                  if (!active) {
                    onOpen()
                  }
                }} className='w-full py-4 mt-4 font-semibold rounded-big'
              >
                {active ? 'Swap' : 'Connect Wallet'}
              </RegularButton>
            )
          }}
        </ConnectWallet>
        {active && hasTooHighPriceImpact && (
          <div className='py-3 px-4 pr-2 flex gap-4 mt-4 border border-E52E2E border-l-4 rounded-3px text-E52E2E bg-E52E2E-0.03'>
            <div>
              <Checkbox className='border-E52E2E w-4 h-4 border-1 focus:ring-E52E2E text-E52E2E focus:border-E52E2E' />
            </div>
            <div className='text-sm -ml-3'>
              Price impact is too high. You will lose a big portion of your funds in this trade. Please tick the box if you would like to continue.
            </div>
          </div>
        )}

        {active && (
          <div className='flex flex-col gap-4 mt-4 bg-F3F5F7 rounded-tooltip p-4'>
            <div className='flex justify-between'>
              <div className='text-sm'>Price Impact</div>
              <div className={'text-sm font-semibold' + (hasHighPriceImpact ? ' text-E52E2E' : '')}>-0.3%</div>
            </div>
            <div className='flex justify-between'>
              <div className='text-sm'>Est. received</div>
              <div className='text-sm font-semibold'>31.1128 SUSHI</div>
            </div>
            <div className='flex justify-between'>
              <div className='text-sm'>Min. received</div>
              <div className='text-sm font-semibold'>31.1128 SUSHI</div>
            </div>
            <div className='flex justify-between'>
              <div className='text-sm'>Network fee</div>
              <div className='text-sm font-semibold'>~$6.76</div>
            </div>
            <div className='flex justify-between'>
              <div className='text-sm'>Route</div>
              <div className='text-sm font-semibold cursor-pointer text-4e7dd9'>View</div>
            </div>
            <hr className='border-none h-[1px] bg-B0C4DB' />
            <div className='flex justify-between'>
              <div className='text-sm'>Recipient</div>
              <div className='text-sm font-semibold'>OxEC7D…0901</div>
            </div>
          </div>
        )}

      </div>

      <TokenSelect
        show={isSelectTokenOpen}
        toggleSelectToken={toggleSelectToken}
        handleTokenSelect={handleTokenSelect}
      />

      <TradeSettings
        show={isSettingsOpen}
        hide={() => setIsSettingsOpen(false)}
      />
    </SwapContentCard>

  )
}

export default TradeView
