const { TokenAvatar } = require('@/modules/swap/add-liquidity/TokenAvatar')

const TokenPair = ({ pair }) => {
  return (
    <div className='flex items-center gap-1'>
      <div className='flex items-center'>
        <TokenAvatar className='w-5 h-5' src={pair[0].logoSrc} verified={pair[0].verified} />
        <TokenAvatar className='w-5 h-5 translate-x-[-8px] border-2 border-F3F5F7 box-content' src={pair[1].logoSrc} verified={pair[1].verified} />
      </div>
      <div className='text-sm'>
        {pair[0].symbol}/{pair[1].symbol}
      </div>
    </div>
  )
}

export { TokenPair }
