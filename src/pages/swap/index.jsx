import { Seo } from '@/common/Seo'
import SwapTabSwitcher from '@/modules/swap/common/SwapTabSwitcher'
import TradeView from '@/modules/swap/trade'

const SwapPage = () => {
  return (
    <main>
      <Seo />
      <div className='p-6'>
        <SwapTabSwitcher value='swap' />

        <TradeView />
      </div>
    </main>
  )
}

export default SwapPage
