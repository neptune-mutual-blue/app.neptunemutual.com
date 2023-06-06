import { classNames } from '@/utils/classnames'

export const KeyVal = ({ title, value, valueXl = false, className = '' }) => (
  <div className={classNames('space-y-1 text-sm', className)}>
    <span className='font-semibold text-999BAB'>{title}</span>
    <p className={valueXl ? 'text-xl' : ''}>{value}</p>
  </div>
)
