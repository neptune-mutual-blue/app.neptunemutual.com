import { forwardRef } from 'react'

import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { classNames } from '@/utils/classnames'

/** @type {React.ForwardRefExoticComponent<React.ComponentProps<'button'> & React.RefAttributes<HTMLButtonElement>>} */
export const RegularButton = forwardRef(
  ({ children, className, ...props }, ref) => {
    const { networkId } = useNetwork()
    const { isMainNet, isArbitrum } = useValidateNetwork(networkId)

    const buttonColor = isArbitrum
      ? 'border-1D9AEE bg-1D9AEE focus-visible:ring-1D9AEE'
      : isMainNet
        ? 'border-4e7dd9 bg-4e7dd9 focus-visible:ring-4e7dd9'
        : 'border-5D52DC bg-5D52DC focus-visible:ring-5D52DC'

    return (
      <button
        ref={ref}
        type='button'
        className={classNames(
          props.disabled && 'opacity-75 cursor-not-allowed',
          buttonColor,
          'text-EEEEEE border rounded-lg  focus:outline-none focus-visible:ring-2 uppercase tracking-wide',
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
