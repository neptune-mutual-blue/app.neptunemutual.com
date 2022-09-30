import React, { useRef, useState, useEffect } from 'react'
import { t, Trans } from '@lingui/macro'

import {
  InputField,
  InputDescription,
  ProofOfIncident
} from '@/modules/reporting/form'
import { convertFromUnits, isGreater, convertToUnits } from '@/utils/bn'

import { Container } from '@/common/Container/Container'
import { RegularButton } from '@/common/Button/RegularButton'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'

import { useDisputeIncident } from '@/src/hooks/useDisputeIncident'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { isValidProduct } from '@/src/helpers/cover'

export const NewDisputeReportForm = ({ incidentReport }) => {
  const form = useRef(null)

  const [value, setValue] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const isDiversified = isValidProduct(incidentReport.productKey)

  const { minReportingStake } = useCoverStatsContext()
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
    minStake: minReportingStake,
    isDiversified
  })

  const tokenDecimals = useTokenDecimals(tokenAddress)

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
  }

  return (
    <Container className='pt-12 pb-24 bg-white border-t border-t-B0C4DB max-w-none md:bg-transparent'>
      <form
        data-testid='dispute-report-form'
        ref={form}
        onSubmit={onSubmit}
        className='px-2 mx-auto bg-white max-w-7xl md:py-16 md:px-24'
      >
        <h2 className='mb-4 font-bold text-h2'>
          <Trans>Submit Your Dispute</Trans>
        </h2>

        <InputField
          label={t`Title`}
          inputProps={{
            id: 'dispute_title',
            name: 'title',
            placeholder: t`Enter Dispute Title`,
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
            className='mt-10'
            label={t`Description`}
            inputProps={{
              id: 'description',
              name: 'description',
              className:
                'block w-full py-6 pl-6 mb-10 bg-white border rounded-lg focus:ring-4e7dd9 focus:border-4e7dd9 border-B0C4DB',
              placeholder: t`Provide a brief explanation of the incident along with any of your own research or comments relating to the validity of the incident.`,
              rows: 5,
              maxLength: 300,
              required: canDispute,
              disabled: approving || disputing
            }}
          />
        </div>

        <div className='md:max-w-lg'>
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
              NPM
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
            className='w-full py-6 font-semibold uppercase px-14 xs:px-24 text-h6 md:w-auto'
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
