import { RegularButton } from '@/common/Button/RegularButton'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import DateLib from '@/lib/date/DateLib'
import { useAppConstants } from '@/src/context/AppConstants'
import { useClaimBond } from '@/src/hooks/useClaimBond'
import { useLanguageContext } from '@/src/i18n/i18n'
import { convertFromUnits } from '@/utils/bn'
import { formatAmount } from '@/utils/formatter'
import { fromNow } from '@/utils/formatter/relative-time'
import { Trans } from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'

export const ClaimBondModal = ({
  modalTitle,
  unlockDate,
  claimable,
  isOpen,
  onClose,
  refetchBondInfo
}) => {
  const { handleClaim, claiming } = useClaimBond({ claimable })
  const { locale } = useLanguageContext()
  const { NPMTokenSymbol } = useAppConstants()

  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={claiming}>
      <ModalWrapper className='max-w-md bg-F6F7F9'>
        <Dialog.Title className='font-bold text-display-sm'>
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
              locale
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
            className='text-lg font-medium text-7398C0'
            title={DateLib.toLongDateFormat(unlockDate, locale)}
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
          }}
          className='w-full p-6 mt-8 font-semibold uppercase'
        >
          {claiming ? <Trans>Claiming...</Trans> : <Trans>Claim Now</Trans>}
        </RegularButton>
      </ModalWrapper>
    </ModalRegular>
  )
}
