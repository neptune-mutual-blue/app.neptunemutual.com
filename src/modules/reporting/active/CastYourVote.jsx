import {
  useEffect,
  useMemo,
  useState
} from 'react'

import Link from 'next/link'

import { Alert } from '@/common/Alert/Alert'
import { RegularButton } from '@/common/Button/RegularButton'
import { DataLoadingIndicator } from '@/common/DataLoadingIndicator'
import { Label } from '@/common/Label/Label'
import { RadioReport } from '@/common/RadioReport/RadioReport'
import { TokenAmountInput } from '@/common/TokenAmountInput/TokenAmountInput'
import { MULTIPLIER } from '@/src/config/constants'
import { Routes } from '@/src/config/routes'
import { useNetwork } from '@/src/context/Network'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { useVote } from '@/src/hooks/useVote'
import {
  convertFromUnits,
  convertToUnits,
  isEqualTo,
  isGreater,
  toBN
} from '@/utils/bn'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { useNetwork } from '@/src/context/Network'

export const CastYourVote = ({ incidentReport, idPrefix, reporterCommission, minReportingStake }) => {
  const options = useMemo(() => {
    return [
      { label: <Trans>Incident Occurred</Trans>, value: 'incident-occurred' },
      { label: <Trans>False Reporting</Trans>, value: 'false-reporting' }
    ]
  }, [])

  const [votingType, setVotingType] = useState(options[0].value)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  const { networkId } = useNetwork()

  const { i18n } = useLingui()
  const { networkId } = useNetwork()

  const {
    balance,
    tokenAddress,
    tokenSymbol,
    handleApprove,
    handleAttest,
    handleRefute,
    loadingAllowance,
    loadingBalance,
    approving,
    voting,
    canVote,
    isError
  } = useVote({
    value,
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate
  })

  const tokenDecimals = useTokenDecimals(tokenAddress)

  useEffect(() => {
    if (!value && error) {
      setError('')

      return
    }

    if (!value) {
      return
    }

    if (isGreater(convertToUnits(value), balance)) {
      setError(t(i18n)`Exceeds maximum balance`)

      return
    }

    if (isEqualTo(convertToUnits(value), 0)) {
      setError(t(i18n)`Insufficient Balance`)

      return
    }

    if (error) {
      setError('')
    }
  }, [balance, error, value, i18n])

  const handleRadioChange = (e) => {
    setVotingType(e.target.value)
  }

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance, tokenDecimals).toString())
  }

  const handleValueChange = (val) => {
    if (typeof val === 'string') {
      setValue(val)
    }
  }

  const isFirstDispute =
    votingType === 'false-reporting' &&
    incidentReport.refutationCount.toString() === '0'

  const handleReport = (onTxSuccess) => {
    if (votingType === 'false-reporting') {
      handleRefute()

      return
    }
    handleAttest(onTxSuccess)
  }

  let loadingMessage = ''
  if (loadingBalance) {
    loadingMessage = <Trans>Fetching balance...</Trans>
  } else if (loadingAllowance) {
    loadingMessage = <Trans>Fetching allowance...</Trans>
  }

  return (
    <>
      <h3 className='font-bold text-center lg:text-left text-display-xs'>
        <Trans>Cast Your Vote</Trans>
      </h3>
      <div className='flex flex-col items-center justify-between max-w-lg mt-6 mb-8 sm:justify-start sm:items-start sm:flex-row'>
        {
        options.map((option, idx) => {
          return (
            <RadioReport
              key={idx}
              label={option.label}
              id={idPrefix + 'camp-' + idx}
              name={idPrefix + 'camp'}
              value={option.value}
              checked={votingType === option.value}
              onChange={handleRadioChange}
              disabled={approving || voting}
            />
          )
        })
      }
      </div>
      {!isFirstDispute && (
        <>
          <Label
            htmlFor='stake-to-cast-vote'
            className='mb-2 ml-2 font-semibold uppercase'
          >
            <Trans>Stake</Trans>
          </Label>

          <div className='flex flex-wrap items-start gap-8 mb-11'>
            <div className='flex-auto'>
              <TokenAmountInput
                tokenSymbol={tokenSymbol}
                tokenAddress={tokenAddress}
                tokenBalance={balance}
                handleChooseMax={handleChooseMax}
                inputValue={value}
                inputId='stake-to-cast-vote'
                disabled={approving || voting}
                onChange={handleValueChange}
              >
                {isFirstDispute && (
                  <p className='text-9B9B9B'>
                    <Trans>Minimum Stake:</Trans>{' '}
                    {convertFromUnits(
                      minReportingStake,
                      tokenDecimals
                    ).toString()}{' '}
                    {tokenSymbol}
                  </p>
                )}
                {error && (
                  <p className='flex items-center text-FA5C2F'>{error}</p>
                )}
              </TokenAmountInput>
            </div>
            <div className='w-full lg:w-64'>
              {!canVote
                ? (
                  <RegularButton
                    className='w-full py-6 font-semibold uppercase lg:w-64 whitespace-nowrap text-EEEEEE'
                    onClick={handleApprove}
                    disabled={
                  isError ||
                  approving ||
                  !value ||
                  !!error ||
                  loadingBalance ||
                  loadingAllowance
                }
                  >
                    {approving
                      ? (
                        <Trans>Approving...</Trans>
                        )
                      : (
                        <>
                          <Trans>Approve</Trans> {tokenSymbol}
                        </>
                        )}
                  </RegularButton>
                  )
                : (
                  <RegularButton
                    className='flex-auto w-full py-6 font-semibold uppercase lg:w-64 whitespace-nowrap text-EEEEEE'
                    onClick={() => { return handleReport(() => { return setValue('') }) }}
                    disabled={
                  isError ||
                  voting ||
                  !!error ||
                  loadingBalance ||
                  loadingAllowance
                }
                  >
                    {voting ? t(i18n)`Reporting...` : 'Report'}
                  </RegularButton>
                  )}
              <DataLoadingIndicator message={loadingMessage} />
            </div>
          </div>
        </>
      )}
      {isFirstDispute && (
        <>
          <Alert info>
            <Trans>
              Since you are the first person to dispute this incident reporting,
              you will need to stake at least{' '}
              {convertFromUnits(minReportingStake, tokenDecimals).toString()}{' '}
              {tokenSymbol} tokens. If the majority agree with you, you will earn{' '}
              {toBN(reporterCommission)
                .multipliedBy(100)
                .dividedBy(MULTIPLIER)
                .toString()}
              % of the "incident occurred" side&apos;s tokens.
            </Trans>
          </Alert>
          <Link
            href={Routes.DisputeReport(
              incidentReport.coverKey,
              incidentReport.productKey,
              incidentReport.incidentDate,
              networkId
            )}
            passHref
            legacyBehavior
          >
            <RegularButton
              className='flex-auto w-full py-6 mt-4 font-semibold uppercase lg:w-64 mb-11 sm:mb-0 whitespace-nowrap text-EEEEEE'
            >
              <Trans>Add Dispute</Trans>
            </RegularButton>
          </Link>
        </>
      )}
    </>
  )
}
