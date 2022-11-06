import { ReportingHero } from '@/src/modules/reporting/ReportingHero'
import { RecentVotesTable } from '@/src/modules/reporting/RecentVotesTable'
import { Container } from '@/common/Container/Container'
import { ResolvedReportSummary } from '@/src/modules/reporting/resolved/ResolvedReportSummary'
import DateLib from '@/lib/date/DateLib'
import { isGreater } from '@/utils/bn'
import { ActiveReportSummary } from '@/src/modules/reporting/active/ActiveReportSummary'
import { CastYourVote } from '@/src/modules/reporting/active/CastYourVote'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { useConsensusReportingInfo } from '@/src/hooks/useConsensusReportingInfo'
import { useRetryUntilPassed } from '@/src/hooks/useRetryUntilPassed'
import ReportComments from '@/modules/reporting/ReportComments'

export const ReportingDetailsPage = ({ incidentReport, refetchReport }) => {
  const coverInfo = useCoverOrProductData({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey
  })

  const { info, refetch: refetchInfo } = useConsensusReportingInfo({
    coverKey: incidentReport.coverKey,
    productKey: incidentReport.productKey,
    incidentDate: incidentReport.incidentDate
  })

  const isPassedResolutionDeadline = useRetryUntilPassed(() => {
    if (!incidentReport?.resolved) {
      return false
    }

    const _now = DateLib.unix()
    return isGreater(_now, incidentReport.resolutionDeadline)
  })

  if (!coverInfo) {
    return null
  }

  const now = DateLib.unix()
  const showResolvedSummary =
    incidentReport.resolved && isPassedResolutionDeadline
  const reportingEnded = isGreater(now, incidentReport.resolutionTimestamp)

  return (
    <>
      <ReportingHero
        coverKey={incidentReport.coverKey}
        productKey={incidentReport.productKey}
        coverInfo={coverInfo}
        reportStatus={{ resolved: incidentReport.resolved }}
      />
      <hr className='border-B0C4DB' />
      <Container className='py-16'>
        {showResolvedSummary
          ? (
            <ResolvedReportSummary
              refetchInfo={refetchInfo}
              refetchReport={refetchReport}
              incidentReport={incidentReport}
              yes={info.yes}
              no={info.no}
              myYes={info.myYes}
              myNo={info.myNo}
              willReceive={info.willReceive}
            />
            )
          : (
            <ActiveReportSummary
              refetchInfo={refetchInfo}
              refetchReport={refetchReport}
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
              <CastYourVote incidentReport={incidentReport} idPrefix='mobile' />
            </div>
          )
        }

        <ReportComments
          reportIpfsHash={incidentReport.reportIpfsHash}
          reportIpfsData={incidentReport.reportIpfsData}
          reportIpfsDataTimeStamp={incidentReport.reportTransaction.timestamp}
          disputeIpfsHash={incidentReport.disputeIpfsHash}
          disputeIpfsData={incidentReport.disputeIpfsData}
          disputeIpfsDataTimeStamp={
            incidentReport.disputeTransaction?.timestamp
          }
        />

        <RecentVotesTable
          coverKey={incidentReport.coverKey}
          productKey={incidentReport.productKey}
          incidentDate={incidentReport.incidentDate}
        />
      </Container>
    </>
  )
}
