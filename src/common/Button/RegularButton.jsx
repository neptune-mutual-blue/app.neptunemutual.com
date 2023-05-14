import { forwardRef } from 'react'

import { classNames } from '@/utils/classnames'

/** @type {React.ForwardRefExoticComponent<React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement>>} */
export const RegularButton = forwardRef(
  ({ children, className, ...props }, ref) => {
    const buttonColor = 'border-primary bg-primary focus-visible:ring-primary'

    return (
      <button
        ref={ref}
        type='button'
        className={classNames(
          props.disabled && 'opacity-75 cursor-not-allowed',
          buttonColor,
          'text-EEEEEE border rounded-lg text-md tracking-2 focus:outline-none focus-visible:ring-2 uppercase',
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
