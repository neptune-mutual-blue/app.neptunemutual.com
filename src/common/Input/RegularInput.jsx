import { forwardRef } from 'react'

import { classNames } from '@/utils/classnames'
import { useLingui } from '@lingui/react'

/** @type {React.ForwardRefExoticComponent<React.ComponentProps<'input'> & React.RefAttributes<HTMLInputElement> & {error?:boolean}>} */
export const RegularInput = forwardRef(
  ({ className, error = false, ...inputProps }, ref) => {
    useLingui()

    return (
      <input
        ref={ref}
        autoComplete='off'
        className={classNames(
          'bg-white text-lg block w-full rounded-lg p-6 border placeholder-9B9B9B',
          className,
          inputProps.disabled && 'cursor-not-allowed',
          error
            ? 'border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F'
            : 'border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4E7DD9'
        )}
        {...inputProps}
      />
    )
  }
)

RegularInput.displayName = 'RegularInput'
