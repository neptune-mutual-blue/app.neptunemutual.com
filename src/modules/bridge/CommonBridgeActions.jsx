import { RegularButton } from '@/common/Button/RegularButton'

export const CommonBridgeActions = ({
  approving,
  bridging,
  bridgeTokenSymbol,
  canBridge,
  disabled,
  handleBridge,
  handleApprove
}) => {
  return (
    canBridge
      ? (
        <RegularButton
          className='w-full p-4 mt-4 font-semibold uppercase lg:w-auto rounded-big text-md'
          disabled={disabled}
          onClick={handleBridge}
        >
          {bridging
            ? (
                'Confirming...'
              )
            : (
              <>
                Bridge {bridgeTokenSymbol}
              </>
              )}
        </RegularButton>
        )
      : (
        <RegularButton
          className='w-full p-4 mt-4 font-semibold uppercase lg:w-auto rounded-big text-md'
          disabled={disabled}
          onClick={handleApprove}
        >
          {approving
            ? (
                'Approving...'
              )
            : (
              <>
                Approve {bridgeTokenSymbol}
              </>
              )}
        </RegularButton>
        )
  )
}
