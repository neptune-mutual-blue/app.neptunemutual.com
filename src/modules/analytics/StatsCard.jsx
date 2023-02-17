export const StatsCard = ({ title, value, titleClass = '', valueClass = '' }) => (
  <div>
    <div className={'lg:min-w-analytics-stat text-xs font-normal leading-5 font-poppins pb-2 ' + titleClass}> {title}</div>
    <div className={'text-h5 lg:text-h3 leading-6 font-normal font-poppins text-01052D ' + valueClass}>{value}</div>
  </div>
)
