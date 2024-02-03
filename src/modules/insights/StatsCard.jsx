export const StatsCard = ({ title, value, className = '', titleClass = '', valueClass = '', tooltip = '' }) => {
  return (
    <div className={className}>
      <div className={'lg:min-w-analytics-stat text-xs font-normal leading-5 pb-2 ' + titleClass}> {title}</div>
      <div title={tooltip} className={'text-md lg:text-display-xs leading-6 font-normal text-01052D ' + valueClass}>{value}</div>
    </div>
  )
}
