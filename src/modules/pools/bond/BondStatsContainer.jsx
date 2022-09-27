import { BondStat } from './BondStat'

export const BondStatsContainer = ({ details }) => {
  return (
    <div className='flex flex-wrap justify-between gap-y-3'>
      {details.map((x, idx) => {
        return (
          <BondStat
            key={x.title}
            title={x.title}
            value={x.value}
            tooltip={x.tooltip}
            valueClasses={x.valueClasses}
            titleClasses={x.titleClasses}
            right={idx % 2 !== 0}
          />
        )
      })}
    </div>
  )
}
