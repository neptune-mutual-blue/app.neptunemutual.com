import { useRouter } from 'next/router'

import { RegularButton } from '@/common/Button/RegularButton'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import DateLib from '@/lib/date/DateLib'
import { useAppConstants } from '@/src/context/AppConstants'
import { useClaimBond } from '@/src/hooks/useClaimBond'
import { convertFromUnits } from '@/utils/bn'
import { formatAmount } from '@/utils/formatter'
import { fromNow } from '@/utils/formatter/relative-time'
import {
  t,
  Trans
} from '@lingui/macro'
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
  const router = useRouter()
  const { NPMTokenSymbol } = useAppConstants()

  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={claiming}>
      <ModalWrapper className='max-w-md bg-f6f7f9'>
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
            className='text-lg font-medium text-7398C0'
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
          }}
          className='w-full p-6 mt-8 font-semibold uppercase'
        >
          {claiming ? t`Claiming...` : t`Claim Now`}
        </RegularButton>
      </ModalWrapper>
    </ModalRegular>
  )
}
