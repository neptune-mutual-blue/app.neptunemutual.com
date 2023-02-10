export const StatsCard = ({ title, value }) => (
  <div>
    <div className='text-xs font-normal leading-tight font-poppins pb-2'> {title}</div>
    <div className='text-h2 font-normal font-poppins leading-normal uppercase'>{value}</div>
  </div>
)
