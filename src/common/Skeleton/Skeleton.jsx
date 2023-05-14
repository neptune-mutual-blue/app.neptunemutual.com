import { classNames } from '@/utils/classnames'

const Skeleton = ({ className = '' }) => {
  return (
    <div className={classNames('rounded-1 animate-pulse bg-skeleton', className || 'w-60 h-4')} />
  )
}

export { Skeleton }
