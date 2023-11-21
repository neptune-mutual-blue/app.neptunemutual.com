import { useState } from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { ModalCloseButton } from '@/common/Modal/ModalCloseButton'
import { ModalRegular } from '@/common/Modal/ModalRegular'
import { ModalTitle } from '@/common/Modal/ModalTitle'
import { ModalWrapper } from '@/common/Modal/ModalWrapper'
import { Radio } from '@/common/Radio/Radio'
import { useAppConstants } from '@/src/context/AppConstants'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { useResolveIncident } from '@/src/hooks/useResolveIncident'
import { CountDownTimer } from '@/src/modules/reporting/resolved/CountdownTimer'
import { Trans } from '@lingui/macro'
import * as Dialog from '@radix-ui/react-dialog'

export const ResolveIncident = ({
  refetchAll,
  incidentReport,
  resolvableTill,
  coverKey,
  productKey,
  projectOrProductName
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { resolve, emergencyResolve, resolving, emergencyResolving } =
    useResolveIncident({
      coverKey: coverKey,
      productKey: productKey,
      incidentDate: incidentReport.incidentDate
    })
  const { roles } = useAppConstants()

  const isDiversified = isValidProduct(productKey)

  const logoSource = getCoverImgSrc({
    key: !isDiversified ? coverKey : productKey
  })

  function onClose () {
    setIsOpen(false)
  }

  return (
    <div className='flex flex-col items-center'>
      {incidentReport.resolved && (
        <CountDownTimer title={<Trans>Resolving in</Trans>} target={resolvableTill} />
      )}

      <div className='flex flex-wrap justify-center w-auto gap-10 mb-16'>
        {!incidentReport.resolved && (
          <RegularButton
            disabled={resolving || !roles.isGovernanceAgent}
            className='w-full px-10 py-4 font-semibold uppercase md:w-80'
            onClick={() => {
              resolve(() => {
                setTimeout(refetchAll, 10000)
              })
            }}
            data-testid='resolve'
          >
            {resolving ? <Trans>Resolving...</Trans> : <Trans>Resolve</Trans>}
          </RegularButton>
        )}

        <RegularButton
          disabled={!roles.isGovernanceAdmin}
          className='w-full px-10 py-4 font-semibold uppercase md:w-80'
          onClick={() => { return setIsOpen(true) }}
        >
          <Trans>Emergency resolve</Trans>
        </RegularButton>

        <EmergencyResolveModal
          isOpen={isOpen}
          onClose={onClose}
          refetchAll={refetchAll}
          emergencyResolve={emergencyResolve}
          logoSource={logoSource}
          logoAlt={projectOrProductName}
          emergencyResolving={emergencyResolving}
        />
      </div>
    </div>
  )
}

const options = [
  {
    label: <Trans>Incident Occurred</Trans>,
    id: 'decision-1',
    value: 'true'
  },
  {

    label: <Trans>False reporting</Trans>,
    id: 'decision-2',
    value: 'false'
  }
]

const EmergencyResolveModal = ({
  isOpen,
  onClose,
  refetchAll,
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
      setTimeout(refetchAll, 10000)
      onClose()
    })
  }

  return (
    <ModalRegular
      isOpen={isOpen}
      onClose={onClose}
      disabled={emergencyResolving}
    >
      <ModalWrapper className='max-w-lg bg-F6F7F9'>
        <Dialog.Title className='flex items-center'>
          <ModalTitle imgSrc={logoSource} alt={logoAlt} containerClass='' />
          <div className='font-bold capitalize text-display-sm'>
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
              ? <Trans>Emergency resolving...</Trans>
              : <Trans>Emergency resolve</Trans>}
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
