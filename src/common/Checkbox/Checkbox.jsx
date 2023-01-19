import React from 'react'

import { classNames } from '@/utils/classnames'

/** @type {React.ForwardRefExoticComponent<React.ComponentProps<'input'> & React.RefAttributes<HTMLInputElement>>} */
export const Checkbox = React.forwardRef(
  ({ id, name, children, ...inputProps }, ref) => {
    return (
      <>
        <input
          ref={ref}
          id={id}
          name={name}
          type='checkbox'
          {...inputProps}
          className={classNames('hover:cursor-pointer w-5 h-5 bg-white border-2 rounded checkbox_custom focus:ring-4e7dd9 text-4e7dd9 border-9B9B9B focus:border-4e7dd9 focus:ring focus:ring-offset-0 focus:ring-opacity-30', inputProps.className ?? '')}
        />

        <label htmlFor={id} className='hover:cursor-pointer ml-3 align-middle'>
          {children}
        </label>
      </>
    )
  }
)

Checkbox.displayName = 'Checkbox'
