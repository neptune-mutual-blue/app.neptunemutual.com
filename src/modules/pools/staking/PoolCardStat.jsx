export const PoolCardStat = ({ title, value, tooltip }) => {
  return (
    <>
      <label className='font-semibold capitalize'>{title}</label>
      <span title={tooltip} className='text-right text-7398C0'>{value}</span>
    </>
  )
}
