import { classNames } from '@/utils/classnames'

export const Grid = ({ children, className = '', ...rest }) => {
  return (
    <div
      className={classNames(
        'grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
      data-testid='grid-mock-component'
      {...rest}
    >
      {children}
    </div>
  )
}
