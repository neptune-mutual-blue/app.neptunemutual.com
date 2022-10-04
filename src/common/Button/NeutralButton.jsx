import { classNames } from '@/utils/classnames'

export const NeutralButton = ({ onClick, children, className, ...rest }) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        'block text-B0C4DB py-3 px-4 border border-B0C4DB mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
