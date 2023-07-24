import { classNames } from '@/utils/classnames'

export const OutlinedButton = ({ onClick, children, className, ...rest }) => {
  const buttonColor = 'border-primary focus-visible:ring-primary'

  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        'text-primary py-3 px-4 border hover:bg-primary hover:bg-opacity-10 focus:outline-none focus-visible:ring-2 uppercase text-md tracking-2',
        buttonColor,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export const OutlinedButtonCancel = ({ onClick, children, className }) => {
  const buttonColor = 'border-primary focus-visible:ring-primary'

  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        buttonColor,
        'text-4E7DD9 py-1 px-4 border focus:outline-none focus-visible:ring-2 uppercase tracking-wide hover:opacity-95',
        className
      )}
    >
      {children}
    </button>
  )
}
