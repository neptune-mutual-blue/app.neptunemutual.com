import { Seo } from '@/common/Seo'
import { SwapAddLiquidity } from '@/modules/swap/add-liquidity'
import SwapTabSwitcher from '@/modules/swap/common/SwapTabSwitcher'

const PoolPage = () => {
  return (
    <main>
      <Seo />
      <div className='p-6 min-h-760'>
        <SwapTabSwitcher value='pool' />
        <SwapAddLiquidity />
      </div>

    </main>
  )
}

export default PoolPage
