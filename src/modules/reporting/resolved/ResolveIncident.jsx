import { RegularButton } from '@/common/Button/RegularButton'
import { Radio } from '@/common/Radio/Radio'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { useResolveIncident } from '@/src/hooks/useResolveIncident'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { CountDownTimer } from '@/src/modules/reporting/resolved/CountdownTimer'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { t, Trans } from '@lingui/macro'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useRouter } from 'next/router'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import { useAppConstants } from '@/src/context/AppConstants'

export const ResolveIncident = ({
  refetchInfo,
  refetchReport,
  incidentReport,
  resolvableTill
}) => {
  const router = useRouter()
  const { productId } = router.query
  const [isOpen, setIsOpen] = useState(false)
  const productKey = safeFormatBytes32String(productId || '')
  const { resolve, emergencyResolve, resolving, emergencyResolving } =
    useResolveIncident({
      coverKey: incidentReport.coverKey,
      productKey: productKey,
      incidentDate: incidentReport.incidentDate
    })
  const { roles } = useAppConstants()

  const isDiversified = isValidProduct(incidentReport.productKey)

  const { refetch: refetchCoverStats } = useCoverStatsContext()
  const { coverInfo } = useCoverOrProductData({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey
  })

  const logoSource = getCoverImgSrc({
    key: !isDiversified ? incidentReport.coverKey : incidentReport.productKey
  })

  if (!coverInfo) {
    return <Trans>loading...</Trans>
  }

  const projectName = isDiversified
    ? coverInfo?.infoObj.productName
    : coverInfo?.infoObj.coverName || coverInfo?.infoObj.projectName

  function onClose () {
    setIsOpen(false)
  }

  return (
    <div className='flex flex-col items-center'>
      {incidentReport.resolved && (
        <CountDownTimer title={t`Resolving in`} target={resolvableTill} />
      )}

      <div className='flex flex-wrap justify-center w-auto gap-10 mb-16'>
        {!incidentReport.resolved && (
          <RegularButton
            disabled={resolving || !roles.isGovernanceAgent}
            className='w-full px-10 py-4 font-semibold uppercase md:w-80'
            onClick={() => {
              resolve(() => {
                refetchInfo()
                refetchCoverStats()
                setTimeout(refetchReport, 10000)
              })
            }}
          >
            {resolving ? t`Resolving...` : t`Resolve`}
          </RegularButton>
        )}

        <RegularButton
          disabled={!roles.isGovernanceAdmin}
          className='w-full px-10 py-4 font-semibold uppercase md:w-80'
          onClick={() => setIsOpen(true)}
        >
          <Trans>Emergency resolve</Trans>
        </RegularButton>

        <EmergencyResolveModal
          isOpen={isOpen}
          onClose={onClose}
          refetchCoverStats={refetchCoverStats}
          refetchInfo={refetchInfo}
          refetchReport={refetchReport}
          emergencyResolve={emergencyResolve}
          logoSource={logoSource}
          logoAlt={projectName}
          emergencyResolving={emergencyResolving}
        />
      </div>
    </div>
  )
}

const options = [
  {
    label: t`Incident Occurred`,
    id: 'decision-1',
    value: 'true'
  },
  {

    label: t`False reporting`,
    id: 'decision-2',
    value: 'false'
  }
]

const EmergencyResolveModal = ({
  isOpen,
  onClose,
  refetchCoverStats,
  refetchInfo,
  refetchReport,
  emergencyResolve,
  logoSource,
  logoAlt,
  emergencyResolving
}) => {
  const [decision, setDecision] = useState(undefined)

  const handleRadioChange = (e) => {
    setDecision(e.target.value)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()

    emergencyResolve(decision === 'true', () => {
      refetchInfo()
      refetchCoverStats()
      setTimeout(refetchReport, 10000)
      onClose()
    })
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={emergencyResolving}
    >
      <ModalWrapper className='max-w-lg bg-f6f7f9'>
        <Dialog.Title className='flex items-center'>
          <img
            className='w-10 h-10 mr-3 border rounded-full'
            alt={logoAlt}
            src={logoSource}
          />
          <div className='font-bold capitalize font-inter text-h2'>
            <Trans>Emergency resolution</Trans>
          </div>
        </Dialog.Title>
        <form autoComplete='off' onSubmit={handleSubmit}>
          <div className='mt-8 mb-6 font-semibold uppercase'>
            <Trans>Select your decision</Trans>
          </div>
          <div className='flex flex-col gap-4 my-4 sm:flex-row sm:justify-between'>
            {options.map(option => {
              return (
                <Radio
                  label={option.label}
                  key={option.id}
                  id={option.id}
                  value={option.value}
                  checked={option.value === decision}
                  name='decision'
                  disabled={emergencyResolving}
                  onChange={handleRadioChange}
                  required
                />
              )
            })}
          </div>

          <RegularButton
            type='submit'
            disabled={emergencyResolving}
            className='w-full px-10 py-4 mt-12 font-semibold uppercase'
          >
            {emergencyResolving
              ? t`Emergency resolving...`
              : t`Emergency resolve`}
          </RegularButton>
        </form>

        <ModalCloseButton
          disabled={emergencyResolving}
          onClick={onClose}
        />
      </ModalWrapper>
    </ModalRegular>
  )
}
