import { classNames } from '@/utils/classnames'
import { forwardRef } from 'react'

/** @type {React.ForwardRefExoticComponent<React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement>>} */
export const RegularButton = forwardRef(
  ({ children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type='button'
        className={classNames(
          props.disabled && 'opacity-75 cursor-not-allowed',
          'text-EEEEEE border border-4e7dd9 rounded-lg bg-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9',
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

RegularButton.displayName = 'RegularButton'
