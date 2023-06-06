import { RegularButton } from '@/common/Button/RegularButton'
import {
  t,
  Trans
} from '@lingui/macro'

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
                t`Confirming...`
              )
            : (
              <>
                <Trans>Bridge</Trans> {bridgeTokenSymbol}
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
                t`Approving...`
              )
            : (
              <>
                <Trans>Approve</Trans> {bridgeTokenSymbol}
              </>
              )}
        </RegularButton>
        )
  )
}
