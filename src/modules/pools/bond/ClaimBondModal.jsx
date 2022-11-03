import * as Dialog from '@radix-ui/react-dialog'
import { RegularButton } from '@/common/Button/RegularButton'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { formatAmount } from '@/utils/formatter'
import { convertFromUnits } from '@/utils/bn'
import { useClaimBond } from '@/src/hooks/useClaimBond'
import { fromNow } from '@/utils/formatter/relative-time'
import DateLib from '@/lib/date/DateLib'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { t, Trans } from '@lingui/macro'
import { useRouter } from 'next/router'
import { useAppConstants } from '@/src/context/AppConstants'
import { analyticsLogger } from '@/utils/logger'
import { log } from '@/src/services/logs'
import { useWeb3React } from '@web3-react/core'
import { useEffect } from 'react'

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  claimable,
  isOpen,
  onClose,
  refetchBondInfo
}) => {
  const { handleClaim, claiming } = useClaimBond({ claimable })
  const router = useRouter()
  const { NPMTokenSymbol } = useAppConstants()

  const { chainId, account } = useWeb3React()

  const handleLog = (sequence) => {
    const funnel = 'Claim Bond'
    const journey = 'bond-page'
    let step, event

    switch (sequence) {
      case 2:
        step = 'claim-bond-modal'
        event = 'pop-up'
        break

      case 3:
        step = 'claim-my-bond-button'
        event = 'click'
        break

      case 9999:
        step = 'end'
        event = 'closed'
        break

      default:
        step = 'step'
        event = 'event'
        break
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, {})
    })
  }

  useEffect(() => {
    if (isOpen) handleLog(2)
  }, [isOpen])

  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={claiming}>
      <ModalWrapper className='max-w-md bg-f6f7f9'>
        <Dialog.Title className='font-bold font-sora text-h2'>
          {modalTitle}
        </Dialog.Title>
        <ModalCloseButton
          disabled={claiming}
          onClick={onClose}
        />
        <div className='mt-6'>
          <Label htmlFor='claimable-bond' className='mb-4 font-semibold'>
            <Trans>Amount available to claim</Trans>
          </Label>
          <DisabledInput
            value={formatAmount(
              convertFromUnits(claimable).toString(),
              router.locale
            )}
            unit={NPMTokenSymbol}
          />
        </div>
        <div className='mt-8 modal-unlock'>
          <Label className='mb-3' htmlFor='modal-unlock-on'>
            <Trans>Unlock Date</Trans>
          </Label>
          <p
            id='modal-unlock-on'
            className='font-medium text-7398C0 text-h4'
            title={DateLib.toLongDateFormat(unlockDate, router.locale)}
          >
            {fromNow(unlockDate)}
          </p>
        </div>
        {/* left to add click handler */}
        <RegularButton
          disabled={claiming}
          onClick={() => {
            handleClaim(() => {
              onClose()
              refetchBondInfo()
            })

            handleLog(3)
            handleLog(9999)
          }}
          className='w-full p-6 mt-8 font-semibold uppercase text-h6'
        >
          {claiming ? t`Claiming...` : t`Claim Now`}
        </RegularButton>
      </ModalWrapper>
    </ModalRegular>
  )
}
