import { classNames } from '@/utils/classnames'

export const OutlinedButton = ({ onClick, children, className, ...rest }) => {
  const buttonColor = 'border-custom-theme hover:bg-custom-theme focus-visible:ring-custom-theme'

  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        buttonColor,
        'text-4e7dd9 py-3 px-4 border hover:text-white focus:outline-none focus-visible:ring-2 uppercase text-md tracking-2',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export const OutlinedButtonCancel = ({ onClick, children, className }) => {
  const buttonColor = 'border-custom-theme focus-visible:ring-custom-theme'

  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        buttonColor,
        'text-4e7dd9 py-1 px-4 border focus:outline-none focus-visible:ring-2 uppercase tracking-wide hover:opacity-80',
        className
      )}
    >
      {children}
    </button>
  )
}
