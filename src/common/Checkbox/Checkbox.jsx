import React from 'react'

import { classNames } from '@/utils/classnames'

/** @type {React.ForwardRefExoticComponent<React.ComponentProps<'input'> & React.RefAttributes<HTMLInputElement> & { labelClassName?: string}>} */
export const Checkbox = React.forwardRef(
  ({ id, name, children, disabled, labelClassName = '', ...inputProps }, ref) => {
    return (
      <>
        <input
          ref={ref}
          id={id}
          name={name}
          type='checkbox'
          disabled={disabled}
          {...inputProps}
          className={classNames('hover:cursor-pointer w-5 h-5 bg-white border-2 rounded checkbox_custom focus:ring-4E7DD9 text-4E7DD9 border-9B9B9B focus:border-4E7DD9 focus:ring focus:ring-offset-0 focus:ring-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed', inputProps.className ?? '')}
        />
        {children && (
          <label
            htmlFor={id}
            className={classNames('hover:cursor-pointer ml-3 align-middle', labelClassName ?? '', disabled && 'opacity-50 !cursor-not-allowed')}
          >
            {children}
          </label>
        )}
      </>
    )
  }
)

Checkbox.displayName = 'Checkbox'
