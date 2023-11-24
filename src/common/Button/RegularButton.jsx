import React, { forwardRef } from 'react'

import Link from 'next/link'

import { classNames } from '@/utils/classnames'

/** @type {React.ForwardRefExoticComponent<React.ComponentProps<'button'> & {link?: string} & React.RefAttributes<HTMLButtonElement>>} */
export const RegularButton = forwardRef(
  ({ children, className, link, ...props }, ref) => {
    const buttonColor = 'border-primary bg-primary focus-visible:ring-primary'

    if (link) {
      return (
        (
          <Link
            href={link}
            className={classNames(
              buttonColor,
              'block text-center text-EEEEEE border rounded-lg text-md tracking-2 focus:outline-none focus-visible:ring-2 uppercase',
              className
            )}
          >

            {children}

          </Link>
        )
      )
    }

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
