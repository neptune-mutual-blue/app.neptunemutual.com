import { getNumber } from '@/common/IconWithBadge'
import ChevronDownIcon from '@/icons/ChevronDownIcon'
import { ResultBar } from '@/modules/governance/proposals-table/result-bars/ResultBar'
import { classNames } from '@/utils/classnames'
import { useState } from 'react'

export const colorArray = [
  ['#6927DA', '#875BF7'],
  ['#2E90FA', '#175CD3'],
  ['#15B79E', '#107569'],
  ['#66C61C', '#3B7C0F']
]

const DISPLAY_COUNT = 4

export const Results = ({ results = [] }) => {
  const [expanded, setExpanded] = useState(false)

  if (!results.length) { return null }

  const filteredResults = expanded ? results : results.slice(0, DISPLAY_COUNT)

  return (
    <div className='space-y-2'>
      {
        filteredResults.map((result, i) => {
          return (
            <ResultBar
              key={i}
              name={result.name}
              value={result.value}
              percent={result.percent}
              colors={colorArray[i % colorArray.length]}
            />
          )
        })
      }

      {
        results.length > DISPLAY_COUNT && (
          <button
            className='flex items-center gap-1'
            onClick={() => { return setExpanded(prev => { return !prev }) }}
          >
            <span className='text-xs uppercase opacity-40'>
              {
                expanded ? 'SEE LESS' : `${getNumber(results.length, DISPLAY_COUNT)} More`
              }
            </span>

            <ChevronDownIcon className={classNames('w-4 h-4', expanded && 'transform rotate-180')} />
          </button>
        )
      }
    </div>
  )
}
