import React from 'react'

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
          className='w-5 h-5 bg-white border-2 rounded focus:ring-4e7dd9 text-4e7dd9 border-9B9B9B'
          {...inputProps}
        />

        <label htmlFor={id} className='ml-3 align-middle'>
          {children}
        </label>
      </>
    )
  }
)

Checkbox.displayName = 'Checkbox'
