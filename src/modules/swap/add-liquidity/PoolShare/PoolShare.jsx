const PoolShare = ({ selectedPair }) => {
  return (
    <div className='p-4 bg-F3F5F7 rounded-tooltip mt-4'>
      <div className='flex flex-col gap-4'>

        <div className='text-sm text-center'>Initial prices and pool share</div>

        <hr className='border-t border-B0C4DB' />

        <div className='flex items-center justify-between'>
          <div className='text-sm'>{selectedPair[0].symbol} per {selectedPair[1].symbol}</div>
          <div className='flex items-center text-sm gap-1'>
            <div className='font-semibold'>0.00</div>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>{selectedPair[1].symbol} per {selectedPair[0].symbol}</div>
          <div className='flex items-center text-sm gap-1'>
            <div className='font-semibold'>0.00</div>
          </div>
        </div>

        <div className='flex items-center justify-between'>
          <div className='text-sm'>Share of Pool:</div>
          <div className='flex items-center text-sm gap-1'>
            <div className='font-semibold'>100%</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolShare
