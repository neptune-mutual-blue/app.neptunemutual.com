import { classNames } from '@/utils/classnames'

export const Tab = ({ children, active, className = '' }) => {
  return (
    <div
      data-testid='tab-container'
      className={classNames(
        'cursor-pointer mr-3 -mb-px whitespace-nowrap overflow-x-hidden',
        active
          ? 'text-4E7DD9 border border-b-0 font-semibold rounded-t-lg border-solid border-B0C4DB bg-F6F7F9'
          : 'text-black',
        className
      )}
    >
      {children}
    </div>
  )
}
