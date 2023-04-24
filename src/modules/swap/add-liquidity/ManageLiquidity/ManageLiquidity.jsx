import { RegularButton } from '@/common/Button/RegularButton'
import ExternalLinkIcon from '@/icons/ExternalLinkIcon'
import LeftArrow from '@/icons/LeftArrow'
import MyPoolShare from '@/modules/swap/add-liquidity/MyPoolShare/MyPoolShare'

const ManageLiquidity = ({ selectedPair, hide, onAdd, onRemove }) => {
  return (
    <div>
      <div className='grid grid-cols-3 items-center'>
        <button
          className='flex items-center gap-2.5 text-xs font-semibold leading-6 rounded-2 tracking-2'
          onClick={hide}
        >
          <LeftArrow />
          <span className='text-xs leading-6 font-semibold'>
            BACK
          </span>
        </button>

        <h3 className='text-display-xs font-semibold'>{selectedPair[0].symbol}/{selectedPair[1].symbol}</h3>
      </div>
      <MyPoolShare
        selectedPair={selectedPair} footer={(
          <>
            <hr className='border-t border-B0C4DB' />

            <div className='text-center text-4e7dd9 flex justify-center gap-1 items-center'>
              <div className='text-sm font-semibold'>View Pool Information</div>
              <ExternalLinkIcon />
            </div>

            <div className='grid grid-cols-2 gap-2'>
              <RegularButton className='font-semibold' onClick={onAdd}>
                ADD
              </RegularButton>

              <button
                onClick={onRemove}
                className='flex-grow px-6 py-4 mr-4 tracking-wide uppercase font-semibold border border-solid border-4e7dd9 text-4e7dd9 md:py-2 rounded-tooltip min-w-60 md:mr-2'
              >
                Remove
              </button>
            </div>
          </>
      )}
      />
    </div>
  )
}

export default ManageLiquidity
