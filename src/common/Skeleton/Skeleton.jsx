import { classNames } from '@/utils/classnames'

export const Skeleton = ({ className = '', children = <></> }) => {
  return (
    <div className={classNames('rounded-1 animate-pulse bg-skeleton', className || 'w-60 h-4')}>
      {children}
    </div>
  )
}
