import { RegularButton } from '@/common/Button/RegularButton'
import { DisabledInput } from '@/common/Input/DisabledInput'
import { Label } from '@/common/Label/Label'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import DateLib from '@/lib/date/DateLib'
import { classNames } from '@/lib/toast/utils'
import { useAppConstants } from '@/src/context/AppConstants'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useRetryUntilPassed } from '@/src/hooks/useRetryUntilPassed'
import { useUnstakeReportingStake } from '@/src/hooks/useUnstakeReportingStake'
import { CountDownTimer } from '@/src/modules/reporting/resolved/CountdownTimer'
import { log } from '@/src/services/logs'
import { convertFromUnits, isGreater } from '@/utils/bn'
import { analyticsLogger } from '@/utils/logger'
import { t, Trans } from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'

export const UnstakeYourAmount = ({ incidentReport, willReceive, refetchInfo, projectOrProductName }) => {
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
    if (!incidentReport.decision) return true

    const _now = DateLib.unix()
    return isGreater(_now, incidentReport.claimExpiresAt)
  })

  const isClaimStarted = useRetryUntilPassed(() => {
    // If false reporting, we don't care about the claim period
    if (!incidentReport.decision) return true

    const _now = DateLib.unix()
    return isGreater(_now, incidentReport.claimBeginsFrom)
  })

  const handleUnstakeSuccess = useCallback(
    () => {
      refetchInfo()
      onClose()
    },
    [refetchInfo]
  )

  const { account, chainId } = useWeb3React()
  const { query } = useRouter()

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

  const handleLog = () => {
    const funnel = 'Submit Dispute'
    const journey = `${query?.coverId}${query?.productId ? '-' + query.productId : ''}-${query?.timestamp}-incident-page`

    const step = 'unstake-button'
    const sequence = 1
    const event = 'click'
    const props = {
      coverKey: incidentReport?.coverKey,
      coverName: query?.coverId,
      incidentDate: incidentReport?.incidentDate
    }

    if (query?.productId) {
      props.productKey = incidentReport?.productKey
      props.productName = query?.productId
    }

    const step2 = 'end'
    const sequence2 = 9999
    const event2 = 'closed'

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, props)
      log(chainId, funnel, journey, step2, sequence2, account, event2, {})
    })
  }

  return (
    <div className='flex flex-col items-center pt-4'>
      <span className={classNames('font-semibold', !isClaimableNow && 'mb-4')}>
        <Trans>Result:</Trans>{' '}
        {incidentReport.decision ? t`Incident Occurred` : t`False Reporting`}{' '}
        {incidentReport.emergencyResolved && <>({t`Emergency Resolved`})</>}
      </span>

      {isClaimableNow && (
        <CountDownTimer
          title={t`Claim ends in`}
          target={incidentReport.claimExpiresAt}
        />
      )}

      {notClaimableYet && (
        <CountDownTimer
          title={t`Claim begins in`}
          target={incidentReport.claimBeginsFrom}
        />
      )}

      <RegularButton
        className='w-full px-10 py-4 mb-16 font-semibold md:w-80'
        onClick={() => {
          setIsOpen(true)
          handleLog()
        }}
      >
        <Trans>UNSTAKE</Trans>
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
      <ModalWrapper className='max-w-md bg-f6f7f9'>
        <Dialog.Title className='flex items-center'>
          <img
            className='w-10 h-10 mr-3 border rounded-full'
            alt={logoAlt}
            src={logoSrc}
          />
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
          {unstaking ? t`Unstaking...` : t`Unstake`}
        </RegularButton>

        <ModalCloseButton
          disabled={unstaking}
          onClick={onClose}
        />
      </ModalWrapper>
    </ModalRegular>
  )
}
