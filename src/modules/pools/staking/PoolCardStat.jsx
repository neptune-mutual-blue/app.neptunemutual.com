export const PoolCardStat = ({ title, value, tooltip }) => {
  return (
    <>
      <label className='font-semibold capitalize' data-testid='pod-staking-card-stat'>{title}</label>
      <span title={tooltip} className='text-right text-7398C0' data-testid='stat-value'>{value}</span>
    </>
  )
}
