import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import DateLib from '@/lib/date/DateLib'
import { HlCalendar } from '@/lib/hl-calendar'
import {
  ReportingPeriodStatus
} from '@/modules/reporting/ReportingPeriodStatus'
import { useAppConstants } from '@/src/context/AppConstants'
import { useRetryUntilPassed } from '@/src/hooks/useRetryUntilPassed'
import { useLanguageContext } from '@/src/i18n/i18n'
import { CastYourVote } from '@/src/modules/reporting/active/CastYourVote'
import { IncidentReporter } from '@/src/modules/reporting/IncidentReporter'
import { InsightsTable } from '@/src/modules/reporting/InsightsTable'
import {
  ResolveIncident
} from '@/src/modules/reporting/resolved/ResolveIncident'
import {
  VotesSummaryDoughnutChart
} from '@/src/modules/reporting/VotesSummaryDoughnutCharts'
import {
  VotesSummaryHorizontalChart
} from '@/src/modules/reporting/VotesSummaryHorizontalChart'
import { truncateAddressParam } from '@/utils/address'
import {
  convertFromUnits,
  isGreater,
  sumOf,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import {
  t,
  Trans
} from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const ActiveReportSummary = ({
  coverKey,
  productKey,
  projectOrProductName,
  reporterCommission,
  minReportingStake,
  refetchAll,
  incidentReport,
  resolvableTill,
  yes,
  no,
  myYes,
  myNo
}) => {
  const { locale } = useLanguageContext()
  const startDate = DateLib.fromUnix(incidentReport.incidentDate)
  const endDate = DateLib.fromUnix(incidentReport.reportResolutionTimestamp)
  const { NPMTokenSymbol, NPMTokenDecimals } = useAppConstants()

  const { i18n } = useLingui()

  const isAfterResolution = useRetryUntilPassed(() => {
    const _now = DateLib.unix()

    return isGreater(_now, incidentReport.reportResolutionTimestamp)
  })

  const votes = {
    yes: convertFromUnits(yes, NPMTokenDecimals).toString(),
    no: convertFromUnits(no, NPMTokenDecimals).toString()
  }

  const yesPercent = toBN(votes.yes).dividedBy(sumOf(votes.yes, votes.no))
    .decimalPlaces(2)
    .toNumber()
  const noPercent = toBN(1).minus(yesPercent)
    .decimalPlaces(2)
    .toNumber()

  let isAttestedWon = incidentReport.resolutionDecision

  if (incidentReport.resolutionDecision === null) {
    isAttestedWon = isGreater(
      incidentReport.totalAttestationStake,
      incidentReport.totalRefutationStake
    )
  }

  const majority = {
    voteCount: isAttestedWon
      ? incidentReport.attestationCount
      : incidentReport.refutationCount,
    stake: isAttestedWon ? yes : no,
    percent: isAttestedWon ? yesPercent : noPercent,
    variant: isAttestedWon ? 'success' : 'failure'
  }

  return (
    <>
      <OutlinedCard className='bg-white md:flex'>
        {/* Left half */}
        <div className='flex-1 p-6 pb-0 sm:pb-6 lg:p-10 md:border-r border-B0C4DB min-w-300'>
          <h2 className='mb-6 font-bold text-center text-display-xs lg:text-left'>
            <Trans>Report Summary</Trans>
          </h2>

          {!isAfterResolution && (
            <>
              <VotesSummaryDoughnutChart
                votes={votes}
                yesPercent={yesPercent}
                noPercent={noPercent}
              />
              <Divider />
            </>
          )}

          <VotesSummaryHorizontalChart
            yesPercent={yesPercent}
            noPercent={noPercent}
            showTooltip={isAfterResolution}
            majority={majority}
          />
          <Divider />

          <>
            {isAfterResolution
              ? (
                <ResolveIncident
                  refetchAll={refetchAll}
                  projectOrProductName={projectOrProductName}
                  incidentReport={incidentReport}
                  resolvableTill={resolvableTill}
                  coverKey={coverKey}
                  productKey={productKey}
                />
                )
              : (
                <div className='hidden md:block'> {/* hidden in mobile */}
                  <CastYourVote
                    incidentReport={incidentReport}
                    idPrefix='desktop-'
                    reporterCommission={reporterCommission}
                    minReportingStake={minReportingStake}
                  />

                </div>
                )}
          </>
        </div>

        {/* Right half */}
        <div className='p-6 pt-0 lg:p-10 sm:pt-6'>
          <h3 className='mb-4 text-lg font-bold'>Insights</h3>
          <InsightsTable
            insights={[
              {
                title: t(i18n)`Incident Occurred`,
                value: formatPercent(yesPercent, locale),
                variant: 'success'
              },
              {
                title: t(i18n)`User Votes:`,
                value: incidentReport.attestationCount
              },
              {
                title: t(i18n)`Stake:`,
                value: formatCurrency(
                  incidentReport.totalAttestationStake,
                  locale,
                  NPMTokenSymbol,
                  true
                ).short,
                htmlTooltip: formatCurrency(
                  incidentReport.totalAttestationStake,
                  locale,
                  NPMTokenSymbol,
                  true
                ).long
              },
              {
                title: t(i18n)`Your Stake`,
                value: formatCurrency(
                  convertFromUnits(myYes),
                  locale,
                  NPMTokenSymbol,
                  true
                ).short,
                htmlTooltip: formatCurrency(
                  convertFromUnits(myYes),
                  locale,
                  NPMTokenSymbol,
                  true
                ).long
              }
            ]}
          />

          <hr className='mt-4 mb-6 border-t border-D4DFEE' />
          <InsightsTable
            insights={[
              {
                title: t(i18n)`False Reporting`,
                value: formatPercent(noPercent, locale),
                variant: 'error'
              },
              {
                title: t(i18n)`User Votes:`,
                value: incidentReport.refutationCount
              },
              {
                title: t(i18n)`Stake:`,
                value: `${
                  formatCurrency(
                    incidentReport.totalRefutationStake,
                    locale,
                    NPMTokenSymbol,
                    true
                  ).short
                }`,
                htmlTooltip: `${
                  formatCurrency(
                    incidentReport.totalRefutationStake,
                    locale,
                    NPMTokenSymbol,
                    true
                  ).long
                }`
              },
              {
                title: t(i18n)`Your Stake`,
                value: formatCurrency(
                  convertFromUnits(myNo),
                  locale,
                  NPMTokenSymbol,
                  true
                ).short,
                htmlTooltip: formatCurrency(
                  convertFromUnits(myNo),
                  locale,
                  NPMTokenSymbol,
                  true
                ).long
              }
            ]}
          />

          <hr className='mt-6 mb-6 border-t border-D4DFEE' />
          <h3 className='mb-4 text-lg font-bold'>
            <Trans>Incident Reporters</Trans>
          </h3>
          <IncidentReporter
            variant='success'
            account={truncateAddressParam(incidentReport.reporter, 8, -6)}
            txHash={incidentReport.reportTransaction}
          />
          {incidentReport.disputer && (
            <IncidentReporter
              variant='error'
              account={truncateAddressParam(incidentReport.disputer, 8, -6)}
              txHash={incidentReport.disputeTransaction}
            />
          )}

          <hr className='mt-8 mb-6 border-t border-D4DFEE' />
          <h3 className='mb-4 text-lg font-bold'>
            <Trans>Reporting Period</Trans>
          </h3>
          <ReportingPeriodStatus
            reportingEndsAt={incidentReport.reportResolutionTimestamp}
          />
          <p className='text-sm opacity-50 mr-1.5'>
            <span
              title={DateLib.toLongDateFormat(
                incidentReport.incidentDate,
                locale
              )}
            >
              {DateLib.toDateFormat(
                incidentReport.incidentDate,
                locale,
                { month: 'short', day: 'numeric' },
                'UTC'
              )}
            </span>
            {' - '}
            <span
              title={DateLib.toLongDateFormat(
                incidentReport.reportResolutionTimestamp,
                locale
              )}
            >
              {DateLib.toDateFormat(
                incidentReport.reportResolutionTimestamp,
                locale,
                { month: 'short', day: 'numeric' },
                'UTC'
              )}
            </span>
          </p>
          {!isAfterResolution && (
            <HlCalendar startDate={startDate} endDate={endDate} />
          )}
        </div>
      </OutlinedCard>
    </>
  )
}
