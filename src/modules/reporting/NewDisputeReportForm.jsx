import {
  useEffect,
  useRef,
  useState
} from 'react'

import { RegularButton } from '@/common/Button/RegularButton'
import { Container } from '@/common/Container/Container'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import {
  InputDescription,
  InputField,
  ProofOfIncident
} from '@/modules/reporting/form'
import { useDisputeIncident } from '@/src/hooks/useDisputeIncident'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { log } from '@/src/services/logs'
import {
  convertFromUnits,
  convertToUnits,
  isGreater
} from '@/utils/bn'
import { analyticsLogger } from '@/utils/logger'
import {
  t,
  Trans
} from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export const NewDisputeReportForm = ({ incidentReport, minReportingStake }) => {
  const form = useRef(null)

  const [value, setValue] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const {
    balance,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    handleDispute,
    approving,
    disputing,
    canDispute
  } = useDisputeIncident({
    value,
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate,
    minStake: minReportingStake
  })

  const tokenDecimals = useTokenDecimals(tokenAddress)

  const { account, chainId } = useWeb3React()

  useEffect(() => {
    setButtonDisabled(approving || disputing || !value)
  }, [approving, disputing, value])

  function handleStakeChange (val) {
    if (typeof val === 'string') setValue(val)
  }

  function handleChooseMax (e) {
    e.preventDefault()
    setValue(convertFromUnits(balance, tokenDecimals).toString())
  }

  function onSubmit (e) {
    e.preventDefault()

    if (!canDispute) {
      // ask for approval
      handleApprove()
      handleLog(1)
      return
    }

    if (!form.current) {
      return
    }

    // process form and submit report
    const { current } = form

    const incidentUrl =
      (current.incident_url || []).length > 1
        ? current.incident_url
        : [current.incident_url]

    const urlReports = Object.keys(incidentUrl).map(
      (i) => incidentUrl[i]?.value
    )

    const payload = {
      title: current.title?.value,
      proofOfDispute: urlReports,
      description: current.description?.value,
      stake: convertToUnits(value).toString()
    }
    handleDispute(payload)

    handleLog(2)
    handleLog(9999)
  }

  const handleLog = (sequence) => {
    const funnel = 'Submit Dispute'
    const journey = 'dispute-incident-page-with-form'

    let step, event
    switch (sequence) {
      case 1:
        step = 'approve-button'
        event = 'click'
        break

      case 2:
        step = 'dispute-button'
        event = 'click'
        break

      case 9999:
        step = 'report-incident-button'
        event = 'closed'
        break

      default:
        step = 'step'
        break
    }

    analyticsLogger(() => {
      log(chainId, funnel, journey, step, sequence, account, event, {})
    })
  }

  return (
    <Container className='pt-12 bg-white border-t pb-44 border-t-B0C4DB max-w-none md:bg-transparent'>
      <form
        autoComplete='off'
        data-testid='dispute-report-form'
        ref={form}
        onSubmit={onSubmit}
        className='px-2 mx-auto bg-white border rounded-lg max-w-7xl md:py-16 md:px-24 border-B0C4DB'
      >
        <h2 className='mb-4 font-bold text-display-sm'>
          <Trans>Submit Your Dispute</Trans>
        </h2>

        <InputField
          label={t`Title`}
          className='my-12'
          inputProps={{
            id: 'dispute_title',
            name: 'title',
            placeholder: t`Enter Dispute Title`,
            type: 'text',
            required: canDispute,
            disabled: approving || disputing
          }}
          desc={t`Enter the dispute title.`}
        />

        <ProofOfIncident
          disabled={approving || disputing}
          required={canDispute}
        />

        <div className='relative'>
          <InputDescription
            className='mt-12'
            label={t`Description`}
            inputProps={{
              id: 'description',
              name: 'description',
              className:
                'block w-full py-6 pl-6 mb-10 bg-white border rounded-lg focus:outline-none focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB',
              placeholder: t`Provide a brief explanation of the incident along with any of your own research or comments relating to the validity of the incident.`,
              rows: 5,
              maxLength: 300,
              required: canDispute,
              disabled: approving || disputing
            }}
          />
        </div>

        <div className='mt-12 md:max-w-lg'>
          <TokenAmountInput
            inputId='stake-amount'
            inputValue={value}
            labelText={t`Enter your stake`}
            tokenBalance={balance}
            tokenSymbol={tokenSymbol}
            tokenAddress={tokenAddress}
            name='stake'
            handleChooseMax={handleChooseMax}
            onChange={handleStakeChange}
            disabled={approving || disputing}
            required
          >
            <p className='text-9B9B9B'>
              <Trans>Minimum Stake:</Trans>{' '}
              {convertFromUnits(minReportingStake, tokenDecimals).toString()}{' '}
              {tokenSymbol}
            </p>
            <span className='flex items-center text-FA5C2F'>
              {/* Show error for Insufficent state */}
              {value && isGreater(minReportingStake, convertToUnits(value)) && (
                <Trans>Insufficient Stake</Trans>
              )}

              {/* Show error for Insufficent balance */}
              {value &&
                isGreater(convertToUnits(value), balance) &&
                isGreater(convertToUnits(value), minReportingStake) && (
                  <Trans>Insufficient Balance</Trans>
              )}
            </span>
          </TokenAmountInput>
        </div>

        <div className='mt-10'>
          <div className='max-w-xs pr-8' data-testid='loaders' />

          <RegularButton
            disabled={buttonDisabled}
            className='w-full py-6 font-semibold uppercase px-14 xs:px-24 md:w-auto'
            type='submit'
          >
            {canDispute && (disputing ? t`Disputing...` : t`Dispute`)}
            {!canDispute &&
              (approving ? t`Approving...` : `${t`Approve`} ${tokenSymbol}`)}
          </RegularButton>
        </div>
      </form>
    </Container>
  )
}
