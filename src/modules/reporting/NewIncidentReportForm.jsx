import { t, Trans } from '@lingui/macro'
import { useEffect, useRef, useState } from 'react'

import {
  InputDescription, InputField, ProofOfIncident
} from '@/modules/reporting/form'
import { convertFromUnits, convertToUnits, isGreater } from '@/utils/bn'

import { RegularButton } from '@/common/Button/RegularButton'
import { Container } from '@/common/Container/Container'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'

import { useReportIncident } from '@/src/hooks/useReportIncident'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'

import { useCoverStatsContext } from '@/common/Cover/CoverStatsContext'
import DateLib from '@/lib/date/DateLib'
import { classNames } from '@/utils/classnames'

/**
 *
 * @param {Object} props
 * @param {string} props.coverKey
 * @param {string} props.productKey
 * @returns
 */
export function NewIncidentReportForm ({ coverKey, productKey }) {
  const max = DateLib.toDateTimeLocal()

  const form = useRef()

  const [value, setValue] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [isDateNoHasValue, setIsDateHasNoValue] = useState(true)
  const [isInActive, setIsInActive] = useState(true)

  const {
    balance,
    loadingBalance,
    loadingAllowance,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    handleReport,
    approving,
    reporting,
    canReport,
    isError
  } = useReportIncident({ coverKey, productKey, value })

  const { minReportingStake } = useCoverStatsContext()
  const tokenDecimals = useTokenDecimals(tokenAddress)

  useEffect(() => {
    setButtonDisabled(
      isError ||
        approving ||
        reporting ||
        !value ||
        loadingAllowance ||
        loadingBalance
    )
  }, [approving, reporting, value, loadingAllowance, loadingBalance, isError])

  /**
   *
   * @param {string | Object} val
   */
  function handleStakeChange (val) {
    if (typeof val === 'string') setValue(val)
  }

  /**
   * @param {Object} e
   */
  function handleChooseMax (e) {
    e && e.preventDefault()
    setValue(convertFromUnits(balance, tokenDecimals).toString())
  }

  /**
   * @param {Object} e
   */
  function handleObserveDateTime (e) {
    e && e.preventDefault()
    setIsDateHasNoValue(!e.target.value)
  }

  /**
   * @param {Object} e
   */
  function handleObserveDateTimeBlurFocus (e) {
    e && e.preventDefault()

    if (e.target.value) {
      setIsInActive(false)
      return
    }

    setIsInActive(e.type === 'blur')
  }

  /**
   * @param {Object} e
   */
  function onSubmit (e) {
    e && e.preventDefault()

    if (canReport) {
      // process form and submit report

      const { current } = form

      const incidentUrl =
        (current?.incident_url || []).length > 1
          ? current?.incident_url
          : [current?.incident_url]

      const urlReports = Object.keys(incidentUrl).map(
        (i) => incidentUrl[i]?.value
      )

      const payload = {
        title: current?.title?.value,
        observed: new Date(current?.incident_date?.value),
        proofOfIncident: urlReports,
        description: current?.description?.value,
        stake: convertToUnits(value).toString()
      }

      handleReport(payload)
    } else {
      // ask for approval
      handleApprove()
    }
  }

  return (
    <Container className='pt-12 pb-24 bg-white max-w-none md:bg-transparent'>
      <form
        autoComplete='off'
        data-testid='incident-report-form'
        ref={form}
        onSubmit={onSubmit}
        className='px-2 mx-auto bg-white border rounded-lg max-w-7xl md:py-16 md:px-24 border-B0C4DB'
      >
        <h2 className='mb-4 font-bold text-display-sm'>
          {/* @note: Intentional Capitalization of the word "Incident" below */}
          <Trans>Report an Incident</Trans>
        </h2>
        <div className='flex flex-col md:flex-row'>
          <InputField
            className='lg:flex-grow md:mr-12'
            label={t`Title`}
            inputProps={{
              id: 'incident_title',
              name: 'title',
              placeholder: t`Enter Incident Title`,
              required: canReport,
              disabled: approving || reporting,
              type: 'text'
            }}
            desc={t`Enter the incident title.`}
          />

          <InputField
            className='mb-6 lg:flex-shrink'
            label={t`Observed Date & Time`}
            inputProps={{
              max: max,
              id: 'incident_date',
              name: 'incident_date',
              type: 'datetime-local',
              required: canReport,
              disabled: approving || reporting,
              onChange: handleObserveDateTime,
              onBlur: handleObserveDateTimeBlurFocus,
              onFocus: handleObserveDateTimeBlurFocus,
              className: classNames(isDateNoHasValue && 'text-9B9B9B', isInActive && 'inactive')
            }}
            desc={t`The date and time you observed the incident.`}
          />
        </div>

        <ProofOfIncident
          disabled={approving || reporting}
          required={canReport}
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
              required: canReport,
              disabled: approving || reporting
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
            disabled={approving || reporting}
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
          <div className='max-w-xs pr-8' data-testid='loaders'>
            {loadingAllowance && (
              <DataLoadingIndicator message={t`Fetching allowance...`} />
            )}

            {loadingBalance && (
              <DataLoadingIndicator message={t`Fetching balance...`} />
            )}
          </div>

          <RegularButton
            disabled={buttonDisabled}
            className='w-full py-6 font-semibold uppercase px-14 xs:px-24 md:w-auto'
            type='submit'
          >
            {canReport && (reporting ? t`Reporting...` : t`Report`)}
            {!canReport &&
              (approving ? t`Approving...` : `${t`Approve`} ${tokenSymbol}`)}
          </RegularButton>
        </div>
      </form>
    </Container>
  )
}
