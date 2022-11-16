import { useNetwork } from '@/src/context/Network'
import { useValidateNetwork } from '@/src/hooks/useValidateNetwork'
import { classNames } from '@/utils/classnames'

export const OutlinedButton = ({ onClick, children, className }) => {
  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        isMainNet ? 'border-4e7dd9 hover:bg-4e7dd9 focus-visible:ring-4e7dd9' : 'border-5D52DC hover:bg-5D52DC focus-visible:ring-5D52DC',
        'text-4e7dd9 py-3 px-4 border hover:text-white focus:outline-none focus-visible:ring-2 uppercase tracking-wide',
        className
      )}
    >
      {children}
    </button>
  )
}
export const OutlinedButtonCancel = ({ onClick, children, className }) => {
  const { networkId } = useNetwork()
  const { isMainNet } = useValidateNetwork(networkId)

  return (
    <button
      type='button'
      onClick={onClick}
      className={classNames(
        isMainNet ? 'border-4e7dd9 focus-visible:ring-4e7dd9' : 'border-5D52DC focus-visible:ring-5D52DC',
        'text-4e7dd9 py-1 px-4 border focus:outline-none focus-visible:ring-2 uppercase tracking-wide hover:opacity-80',
        className
      )}
    >
      {children}
    </button>
  )
}
