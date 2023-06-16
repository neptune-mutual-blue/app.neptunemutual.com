import { useCallback } from 'react'

import { Container } from '@/common/Container/Container'
import DateLib from '@/lib/date/DateLib'
import ReportComments from '@/modules/reporting/ReportComments'
import {
  ReportDetailsSkeleton
} from '@/modules/reporting/ReportDetailsSkeleton'
import {
  useConsensusReportingInfo
} from '@/src/hooks/useConsensusReportingInfo'
import { useRetryUntilPassed } from '@/src/hooks/useRetryUntilPassed'
import {
  ActiveReportSummary
} from '@/src/modules/reporting/active/ActiveReportSummary'
import { CastYourVote } from '@/src/modules/reporting/active/CastYourVote'
import { RecentVotesTable } from '@/src/modules/reporting/RecentVotesTable'
import { ReportingHero } from '@/src/modules/reporting/ReportingHero'
import {
  ResolvedReportSummary
} from '@/src/modules/reporting/resolved/ResolvedReportSummary'
import { isGreater } from '@/utils/bn'

export const ReportingDetailsPage = ({
  incidentReport,
  refetchReport,
  coverKey,
  productKey,
  refetchCoverData,
  projectOrProductName,
  reporterCommission,
  minReportingStake,
  coverOrProductData
}) => {
  const { loading: reportLoading, info, refetch: refetchReportInfo } = useConsensusReportingInfo({
    coverKey,
    productKey,
    incidentDate: incidentReport.incidentDate
  })

  const refetchAll = useCallback(() => {
    refetchReport()
    refetchReportInfo()
    refetchCoverData()
  }, [refetchCoverData, refetchReport, refetchReportInfo])

  const isPassedResolutionDeadline = useRetryUntilPassed(() => {
    if (!incidentReport?.resolved) {
      return false
    }

    const _now = DateLib.unix()

    return isGreater(_now, incidentReport.resolutionDeadline)
  })

  if (reportLoading) {
    return <ReportDetailsSkeleton />
  }

  const now = DateLib.unix()
  const showResolvedSummary = incidentReport.resolved && isPassedResolutionDeadline
  const reportingEnded = isGreater(now, incidentReport.resolutionTimestamp)

  return (
    <div data-testid='reporting-details-page'>
      <ReportingHero
        coverKey={coverKey}
        productKey={productKey}
        incidentDate={incidentReport.incidentDate}
        coverOrProductData={coverOrProductData}
        projectOrProductName={projectOrProductName}
        type='details'
        isResolved={incidentReport.resolved}
      />
      <hr className='border-B0C4DB' />
      <Container className='py-16'>
        {showResolvedSummary
          ? (
            <ResolvedReportSummary
              refetchAll={refetchAll}
              incidentReport={incidentReport}
              yes={info.yes}
              no={info.no}
              myYes={info.myYes}
              myNo={info.myNo}
              willReceive={info.willReceive}
              projectOrProductName={projectOrProductName}
            />
            )
          : (
            <ActiveReportSummary
              coverKey={coverKey}
              productKey={productKey}
              projectOrProductName={projectOrProductName}
              reporterCommission={reporterCommission}
              minReportingStake={minReportingStake}
              refetchAll={refetchAll}
              incidentReport={incidentReport}
              resolvableTill={incidentReport.resolutionDeadline}
              yes={info.yes}
              no={info.no}
              myYes={info.myYes}
              myNo={info.myNo}
            />
            )}
        {
          // to be displayed in mobile only
          !reportingEnded && (
            <div className='block my-16 md:hidden'>
              <CastYourVote
                incidentReport={incidentReport}
                idPrefix='mobile'
                reporterCommission={reporterCommission}
                minReportingStake={minReportingStake}
              />
            </div>
          )
        }

        <ReportComments
          reportIpfsHash={incidentReport.reportIpfsHash}
          reportIpfsDataTimeStamp={incidentReport.reportTransaction.timestamp}
          disputeIpfsHash={incidentReport.disputeIpfsHash}
          disputeIpfsDataTimeStamp={incidentReport.disputeTransaction?.timestamp}
        />

        <RecentVotesTable
          coverKey={incidentReport.coverKey}
          productKey={incidentReport.productKey}
          incidentDate={incidentReport.incidentDate}
        />
      </Container>
    </div>
  )
}
