import { colorArray } from '@/modules/governance/proposals-table/result-bars/Results'
import { toBN } from '@/utils/bn'
import { classNames } from '@/utils/classnames'

export const ResultBar = ({ name, value, percent, colors = colorArray[0] }) => {
  const leftBasis = `${percent}%`
  const rightBasis = `${100 - percent}%`

  return (
    <div className={classNames(
      'relative max-w-70 rounded-xl h-4.5 text-xs text-white font-semibold overflow-hidden',
      'flex items-center w-72'
    )}
    >
      {!toBN(percent).isZero() && (
        <div
          className='h-full pl-2'
          style={{ flexBasis: leftBasis, background: colors[0] }}
        />
      )}
      {!toBN(percent).isGreaterThanOrEqualTo(100) && (
        <div
          className='h-full pr-2'
          style={{ flexBasis: rightBasis, background: colors[1] }}
        />
      )}

      <div className='absolute inset-0 flex items-center justify-between w-full h-full'>
        <span className='pl-2'>{name}</span>
        <span>{value}</span>
        <span className='pr-2'>{percent.toFixed(2)} %</span>
      </div>
    </div>
  )
}
