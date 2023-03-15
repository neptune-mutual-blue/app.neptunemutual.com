export const StatsCard = ({ title, value, titleClass = '', valueClass = '', tooltip = '' }) => (
  <div>
    <div className={'lg:min-w-analytics-stat text-xs font-normal leading-5 pb-2 ' + titleClass}> {title}</div>
    <div title={tooltip} className={'text-h5 lg:text-h3 leading-6 font-normal text-01052D ' + valueClass}>{value}</div>
  </div>
)
