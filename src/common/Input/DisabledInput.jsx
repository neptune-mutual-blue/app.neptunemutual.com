export const DisabledInput = ({ value, unit, ...rest }) => {
  return (
    <div className='flex text-lg text-9B9B9B'>
      <div className='flex items-stretch flex-grow'>
        <span
          data-testid={rest['data-testid']}
          title={value}
          className='block w-full py-6 pl-6 border border-r-0 rounded-l-lg cursor-not-allowed border-B0C4DB'
        >
          <span className='block overflow-hidden text-ellipsis sm:max-w-none max-w-9'>{value}</span>
        </span>
      </div>

      <div className='px-4 py-6 border border-l-0 rounded-r-lg cursor-not-allowed border-B0C4DB'>
        {unit}
      </div>
    </div>
  )
}
