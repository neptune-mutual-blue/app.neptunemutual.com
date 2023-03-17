import { RegularButton } from '@/common/Button/RegularButton'
import { Checkbox } from '@/common/Checkbox/Checkbox'
import { log } from '@/src/services/logs'
import { classNames } from '@/utils/classnames'
import { analyticsLogger } from '@/utils/logger'
import { Trans } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useState } from 'react'

export const AcceptReportRulesForm = ({ onAccept, children }) => {
  const [checked, setChecked] = useState(false)

  const { account, chainId } = useWeb3React()

  const handleLog = (sequence) => {
    const funnel = 'Report an Incident'
    const journey = 'report-incident-page'
    const event = 'click'

    let step
    switch (sequence) {
      case 1:
        step = 'acknowledgement-checkbox'
        break

      case 2:
        step = 'report-incident-button'
        break

      default:
        step = 'step'
        break
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, {})
    })
  }

  const handleChange = (ev) => {
    setChecked(ev.target.checked)

    if (ev.target.checked) handleLog(1)
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()

    if (checked) {
      onAccept()
      handleLog(2)
    }
  }

  return (
    <>
      {/* Accept Rules Form */}
      <form autoComplete='off' onSubmit={handleSubmit} className='mt-20'>
        <Checkbox
          id='checkid'
          name='checkinputname'
          checked={checked}
          onChange={handleChange}
          data-testid='accept-report-rules-check-box'
        >
          <Trans>
            I have read, understood, and agree to the terms of cover rules
          </Trans>
        </Checkbox>
        <br />
        {children}
        <RegularButton
          data-testid='accept-report-rules-next-button'
          disabled={!checked}
          className={classNames(
            !checked && 'opacity-30 cursor-not-allowed',
            'text-md tracking-wider font-bold py-6 px-12 mt-8 w-full md:w-auto'
          )}
          type='submit'
        >
          <Trans>REPORT AN INCIDENT</Trans>
        </RegularButton>
      </form>
    </>
  )
}
