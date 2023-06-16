import { classNames } from '@/utils/classnames'

const KeyValueList = (props) => {
  const { list, className } = props

  return (
    <div className={'bg-F3F5F7 p-4 flex flex-col gap-4 rounded-tooltip' + (className ? ' ' + className : '')}>
      {list.map(item => {
        return (
          <div key={item.key} className='flex justify-between'>
            <div className='text-sm'>{item.key}</div>
            <div title={item.tooltip} className={classNames('text-sm font-semibold', item.caution ? 'text-E52E2E' : '')}>{item.value}</div>
          </div>
        )
      })}
    </div>
  )
}

export default KeyValueList
