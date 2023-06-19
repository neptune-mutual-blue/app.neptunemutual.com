import { classNames } from '@/utils/classnames'

export const KeyVal = ({ heading, title = undefined, value, valueXl = false, className = '' }) => {
  return (
    <div className={classNames('space-y-1 text-sm', className)}>
      <span className='font-semibold text-999BAB'>{heading}</span>
      <p className={valueXl ? 'text-xl' : ''} title={title}>{value}</p>
    </div>
  )
}
