import {
  useCallback,
  useState
} from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalTitle } from '@/common/Modal/ModalTitle'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import DateLib from '@/lib/date/DateLib'
import { classNames } from '@/lib/toast/utils'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useRetryUntilPassed } from '@/src/hooks/useRetryUntilPassed'
import { useUnstakeReportingStake } from '@/src/hooks/useUnstakeReportingStake'
import { CountDownTimer } from '@/src/modules/reporting/resolved/CountdownTimer'
import {
  convertFromUnits,
  isGreater
} from '@/utils/bn'
import { Trans } from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'

export const UnstakeYourAmount = ({ incidentReport, willReceive, refetchAll, projectOrProductName }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDiversified = isValidProduct(incidentReport.productKey)

  const logoSrc = getCoverImgSrc({
    key: isDiversified ? incidentReport.productKey : incidentReport.coverKey
  })

  const { unstake, unstakeWithClaim, unstaking } = useUnstakeReportingStake({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate,
    incidentStatus: incidentReport.status,
    willReceive
  })

  const isClaimExpired = useRetryUntilPassed(() => {
    // If false reporting, we don't care about the claim period
    if (!incidentReport.decision) { return true }

    const _now = DateLib.unix()

    return isGreater(_now, incidentReport.claimExpiresAt)
  })

  const isClaimStarted = useRetryUntilPassed(() => {
    // If false reporting, we don't care about the claim period
    if (!incidentReport.decision) { return true }

    const _now = DateLib.unix()

    return isGreater(_now, incidentReport.claimBeginsFrom)
  })

  const handleUnstakeSuccess = useCallback(
    () => {
      refetchAll()
      onClose()
    },
    [refetchAll]
  )

  const now = DateLib.unix()

  const isIncidentOccurred = incidentReport.decision
  const notClaimableYet = isGreater(incidentReport.claimBeginsFrom, now)
  const isClaimableNow =
    isIncidentOccurred && !isClaimExpired && isClaimStarted

  function onClose () {
    setIsOpen(false)
  }

  const handleUnstake = async () => {
    if (!incidentReport.finalized) {
      await unstakeWithClaim(handleUnstakeSuccess)

      return
    }

    await unstake(handleUnstakeSuccess)
  }

  const hasStake = !(convertFromUnits(willReceive).isZero())

  return (
    <div className='flex flex-col items-center pt-4'>
      <span className={classNames('font-semibold', !isClaimableNow && 'mb-4')}>
        <Trans>Result:</Trans>{' '}
        {incidentReport.decision ? <Trans>Incident Occurred</Trans> : <Trans>False Reporting</Trans>}{' '}
        {incidentReport.emergencyResolved && <Trans>Emergency Resolved</Trans>}
      </span>

      {isClaimableNow && (
        <CountDownTimer
          title={<Trans>Claim ends in</Trans>}
          target={incidentReport.claimExpiresAt}
        />
      )}

      {notClaimableYet && (
        <CountDownTimer
          title={<Trans>Claim begins in</Trans>}
          target={incidentReport.claimBeginsFrom}
        />
      )}

      <RegularButton
        className='w-full px-10 py-4 mb-16 font-semibold uppercase md:w-80'
        onClick={() => { setIsOpen(true) }}
      >
        <Trans>Unstake</Trans>
      </RegularButton>

      <UnstakeModal
        isOpen={isOpen}
        onClose={onClose}
        unstake={handleUnstake}
        reward={convertFromUnits(willReceive).decimalPlaces(2).toString()}
        logoSrc={logoSrc}
        logoAlt={projectOrProductName}
        unstaking={unstaking}
        hasStake={hasStake}
      />
    </div>
  )
}

const UnstakeModal = ({
  isOpen,
  onClose,
  unstake,
  reward,
  logoSrc,
  logoAlt,
  hasStake,
  unstaking
}) => {
  const { NPMTokenSymbol } = useAppConstants()

  return (
    <ModalRegular isOpen={isOpen} onClose={onClose} disabled={unstaking}>
      <ModalWrapper className='max-w-md bg-F6F7F9'>
        <Dialog.Title className='flex items-center'>
          <ModalTitle imgSrc={logoSrc} alt={logoAlt} containerClass='mr-5' />
          <span className='font-bold text-display-sm'>
            <Trans>Unstake</Trans>
          </span>
        </Dialog.Title>

        <div className='my-8'>
          <Label className='mb-4' htmlFor='receive-amount'>
            <Trans>You will receive</Trans>
          </Label>
          <DisabledInput value={reward} unit={NPMTokenSymbol} />
        </div>

        <RegularButton
          disabled={!hasStake || unstaking}
          className='w-full px-10 py-4 font-semibold uppercase'
          onClick={unstake}
        >
          {unstaking ? <Trans>Unstaking...</Trans> : <Trans>Unstake</Trans>}
        </RegularButton>

        <ModalCloseButton
          disabled={unstaking}
          onClick={onClose}
        />
      </ModalWrapper>
    </ModalRegular>
  )
}
