import { RegularButton } from '@/common/Button/RegularButton'
import AddIcon from '@/icons/AddIcon'
import LeftArrow from '@/icons/LeftArrow'
import MyPoolShare from '@/modules/swap/add-liquidity/MyPoolShare/MyPoolShare'
import PoolShare from '@/modules/swap/add-liquidity/PoolShare/PoolShare'
import { TokenInput } from '@/modules/swap/add-liquidity/TokenInput'

const SupplyLiquidity = ({ selectedPair, hide }) => {
  return (
    <div>
      <div className='flex items-center'>
        <button
          className='flex items-center gap-2.5 text-xs font-semibold leading-6 rounded-2 tracking-2'
          onClick={hide}
        >
          <LeftArrow />
          <span className='text-xs leading-6 font-semibold'>
            BACK
          </span>
        </button>

        <h3 className='text-display-xs font-semibold ml-[57px]'>Add Liquidity</h3>
      </div>

      <div className='mt-6 space-y-3'>
        <TokenInput
          openSelectToken={() => {}}
          selectedToken={selectedPair[0]}
        />

        <div className='relative'>
          <TokenInput
            openSelectToken={() => {}}
            selectedToken={selectedPair[1]}
          />
          <div
            className='absolute flex items-center justify-center w-8 h-8 transform -translate-x-1/2 bg-white rounded-full left-1/2 -top-1/4'
          >
            <AddIcon className='w-5 h-5 text-4e7dd9' />
          </div>
        </div>
      </div>

      <RegularButton
        onClick={() => {

        }} className='w-full py-4 mt-4 font-semibold rounded-big'
      >
        Supply
      </RegularButton>

      <PoolShare selectedPair={selectedPair} />

      <h3 className='text-display-xs font-semibold mt-4'>Your Liquidity</h3>
      <MyPoolShare selectedPair={selectedPair} footer={undefined} />
    </div>
  )
}

export default SupplyLiquidity
