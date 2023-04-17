import { RegularButton } from '@/common/Button/RegularButton'
import AddIcon from '@/icons/AddIcon'
import SettingsIcon from '@/icons/SettingsIcon'
import { useState } from 'react'
import { TokenSelect } from '@/modules/swap/add-liquidity/TokenSelect/TokenSelect'
import { TokenInput } from '@/modules/swap/add-liquidity/TokenInput'

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

  return (
    <div className='max-w-md p-8 mx-auto bg-white border rounded-2xl border-B0C4DB'>
      {
        !isSelectTokenOpen &&
          (
            <div>
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

              <RegularButton className='w-full p-4 mt-4 font-semibold rounded-big'>
                CREATE POOL
              </RegularButton>

              <h3 className='mt-4 text-display-xs'>Your Liquidity</h3>

              <div className='p-4 mt-4 text-center rounded-big bg-F3F5F7 text-404040'>
                No Liquidity Found
              </div>
            </div>
          )
      }
      <TokenSelect
        show={isSelectTokenOpen}
        toggleSelectToken={toggleSelectToken}
        handleTokenSelect={handleTokenSelect}
      />
    </div>
  )
}
