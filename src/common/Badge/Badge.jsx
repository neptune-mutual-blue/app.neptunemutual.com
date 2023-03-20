import { classNames } from '@/utils/classnames'

export const Badge = ({ children, className, ...rest }) => {
  return (
    <div className='text-FEFEFF' {...rest}>
      <div
        className={classNames(
          'inline-block px-2 border rounded-xl',
          'text-xs whitespace-nowrap',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
