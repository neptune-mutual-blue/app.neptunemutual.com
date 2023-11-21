import { useRouter } from 'next/router'

import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import DateLib from '@/lib/date/DateLib'
import {
  ReportingPeriodStatus
} from '@/modules/reporting/ReportingPeriodStatus'
import { useAppConstants } from '@/src/context/AppConstants'
import { useCapitalizePool } from '@/src/hooks/useCapitalizePool'
import { useFinalizeIncident } from '@/src/hooks/useFinalizeIncident'
import { IncidentReporter } from '@/src/modules/reporting/IncidentReporter'
import { InsightsTable } from '@/src/modules/reporting/InsightsTable'
import {
  UnstakeYourAmount
} from '@/src/modules/reporting/resolved/UnstakeYourAmount'
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
import { classNames } from '@/utils/classnames'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { formatCurrency } from '@/utils/formatter/currency'
import { formatPercent } from '@/utils/formatter/percent'
import {
  t,
  Trans
} from '@lingui/macro'

export const ResolvedReportSummary = ({
  incidentReport,
  refetchAll,
  yes,
  no,
  myYes,
  myNo,
  willReceive,
  projectOrProductName
}) => {
  const router = useRouter()
  const { productId } = router.query
  const productKey = safeFormatBytes32String(productId || '')
  const { finalize, finalizing } = useFinalizeIncident({
    coverKey: incidentReport.coverKey,
    productKey: productKey,
    incidentDate: incidentReport.incidentDate
  })
  const { capitalize, capitalizing } = useCapitalizePool({
    coverKey: incidentReport.coverKey,
    productKey: productKey,
    incidentDate: incidentReport.incidentDate
  })
  const { NPMTokenSymbol, roles } = useAppConstants()

  const votes = {
    yes: convertFromUnits(yes).toString(),
    no: convertFromUnits(no).toString()
  }

  const yesPercent = toBN(votes.yes).dividedBy(sumOf(votes.yes, votes.no))
    .decimalPlaces(2)
    .toNumber()
  const noPercent = toBN(1).minus(yesPercent)
    .decimalPlaces(2)
    .toNumber()

  let isAttestedWon = incidentReport.decision

  if (incidentReport.decision === null) {
    isAttestedWon = isGreater(
      incidentReport.totalAttestedStake,
      incidentReport.totalRefutedStake
    )
  }

  const majority = {
    voteCount: isAttestedWon
      ? incidentReport.totalAttestedCount
      : incidentReport.totalRefutedCount,
    stake: isAttestedWon ? yes : no,
    percent: isAttestedWon ? yesPercent : noPercent,
    variant: isAttestedWon ? 'success' : 'failure'
  }

  return (
    <>
      <OutlinedCard className='bg-white md:flex'>
        {/* Left half */}
        <div className='flex-1 p-10 md:border-r border-B0C4DB'>
          <h2 className='mb-6 font-bold text-center text-display-xs lg:text-left'>
            <Trans>Report Summary</Trans>
          </h2>

          <VotesSummaryHorizontalChart
            yesPercent={yesPercent}
            noPercent={noPercent}
            showTooltip={incidentReport.resolved}
            majority={majority}
          />
          <Divider />

          <UnstakeYourAmount
            incidentReport={incidentReport}
            willReceive={willReceive}
            refetchAll={refetchAll}
            projectOrProductName={projectOrProductName}
          />
        </div>

        {/* Right half */}
        <div className='p-10'>
          <h3 className='mb-4 text-lg font-bold'>
            <Trans>Insights</Trans>
          </h3>
          <InsightsTable
            insights={[
              {
                title: t`Incident Occurred`,
                value: formatPercent(yesPercent, router.locale),
                variant: 'success'
              },
              {
                title: t`User Votes:`,
                value: incidentReport.totalAttestedCount
              },
              {
                title: t`Stake:`,
                value: formatCurrency(
                  convertFromUnits(incidentReport.totalAttestedStake),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).short,
                htmlTooltip: formatCurrency(
                  convertFromUnits(incidentReport.totalAttestedStake),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).long
              },
              {
                title: t`Your Stake`,
                value: formatCurrency(
                  convertFromUnits(myYes),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).short,
                htmlTooltip: formatCurrency(
                  convertFromUnits(myYes),
                  router.locale,
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
                title: t`False Reporting`,
                value: formatPercent(noPercent, router.locale),
                variant: 'error'
              },
              {
                title: t`User Votes:`,
                value: incidentReport.totalRefutedCount
              },
              {
                title: t`Stake:`,
                value: formatCurrency(
                  convertFromUnits(incidentReport.totalRefutedStake),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).short,
                htmlTooltip: formatCurrency(
                  convertFromUnits(incidentReport.totalRefutedStake),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).long
              },
              {
                title: t`Your Stake`,
                value: formatCurrency(
                  convertFromUnits(myNo),
                  router.locale,
                  NPMTokenSymbol,
                  true
                ).short,
                htmlTooltip: formatCurrency(
                  convertFromUnits(myNo),
                  router.locale,
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
            txHash={incidentReport.reportTransaction.id}
          />
          {incidentReport.disputer && (
            <IncidentReporter
              variant='error'
              account={truncateAddressParam(incidentReport.disputer, 8, -6)}
              txHash={incidentReport.disputeTransaction.id}
            />
          )}

          <hr className='mt-8 mb-6 border-t border-D4DFEE' />
          <h3 className='mb-4 text-lg font-bold'>
            <Trans>Reporting Period</Trans>
          </h3>
          <ReportingPeriodStatus
            resolutionTimestamp={incidentReport.resolutionTimestamp}
          />
          <p className='mb-4 text-sm opacity-50'>
            <span
              title={DateLib.toLongDateFormat(
                incidentReport.incidentDate,
                router.locale
              )}
            >
              {DateLib.toDateFormat(
                incidentReport.incidentDate,
                router.locale,
                { month: 'short', day: 'numeric' },
                'UTC'
              )}
            </span>
            {' - '}
            <span
              title={DateLib.toLongDateFormat(
                incidentReport.resolutionTimestamp,
                router.locale
              )}
            >
              {DateLib.toDateFormat(
                incidentReport.resolutionTimestamp,
                router.locale,
                { month: 'short', day: 'numeric' },
                'UTC'
              )}
            </span>
          </p>

          {!incidentReport.finalized && (
            <>
              <button
                className={classNames(
                  'mt-2 text-sm text-4E7DD9',
                  (finalizing || !roles.isGovernanceAgent) &&
                    'cursor-not-allowed opacity-50'
                )}
                disabled={finalizing || !roles.isGovernanceAgent}
                onClick={() => {
                  finalize(() => {
                    setTimeout(refetchAll, 10000)
                  })
                }}
              >
                {finalizing ? <Trans>Finalizing...</Trans> : <Trans>Finalize</Trans>}
              </button>

              <br />

              <button
                className={classNames(
                  'mt-2 text-sm text-4E7DD9',
                  (capitalizing || !roles.isLiquidityManager) &&
                    'cursor-not-allowed opacity-50'
                )}
                disabled={capitalizing || !roles.isLiquidityManager}
                onClick={() => {
                  capitalize(() => {
                    setTimeout(refetchAll, 10000)
                  })
                }}
              >
                {capitalizing ? <Trans>Capitalizing...</Trans> : <Trans>Capitalize</Trans>}
              </button>
            </>
          )}
        </div>
      </OutlinedCard>
    </>
  )
}
