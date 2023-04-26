import {
  AcceptReportRulesForm
} from '@/common/AcceptCoverRulesForm/AcceptReportRulesForm'
import { Alert } from '@/common/Alert/Alert'
import { Container } from '@/common/Container/Container'
import { CoverResolutionSources } from '@/common/Cover/CoverResolutionSources'
import { CoverParameters } from '@/common/CoverParameters/CoverParameters'
import { MULTIPLIER } from '@/src/config/constants'
import { isValidProduct } from '@/src/helpers/cover'
import { toBN } from '@/utils/bn'
import { Trans } from '@lingui/macro'

import { ReportingInfo } from './ReportingInfo'

export const CoverReportingRules = ({
  coverOrProductData,
  handleAcceptRules,
  activeReportings
}) => {
  const reporterCommission = coverOrProductData?.reporterCommission
  const reportingPeriod = coverOrProductData?.reportingPeriod
  const hasActiveReportings = activeReportings && activeReportings.length > 0
  const isDiversified = isValidProduct(coverOrProductData.productKey)

  const parameters = isDiversified ? coverOrProductData.productInfoDetails?.parameters : coverOrProductData.coverInfoDetails?.parameters
  const projectOrProductName = isDiversified ? coverOrProductData.productInfoDetails?.productName : coverOrProductData.coverInfoDetails?.coverName
  const resolutionSources = isDiversified ? coverOrProductData.productInfoDetails?.resolutionSources : coverOrProductData.coverInfoDetails?.resolutionSources

  return (
    <>
      {/* Content */}
      <div className='pt-12 pb-24 border-t border-t-B0C4DB'>
        <Container className='grid grid-cols-3 md:gap-32'>
          <div className='col-span-3 row-start-3 md:col-span-2 md:row-start-auto'>
            {/* Rules */}

            <CoverParameters parameters={parameters} />
            <div>
              <AcceptReportRulesForm onAccept={handleAcceptRules}>
                <div className='mt-16'>
                  <h2 className='mb-6 font-bold text-display-sm'>
                    <Trans>Active Reporting</Trans>
                  </h2>

                  {!hasActiveReportings && (
                    <p className='mb-10 text-lg text-8F949C'>
                      <Trans>
                        There are no known incidents of {projectOrProductName}.
                      </Trans>
                    </p>
                  )}

                  {hasActiveReportings && (
                    <div className='mb-10'>
                      {activeReportings.map((x) => {
                        return (
                          <ReportingInfo key={x.id} ipfsHash={x.reporterInfo} />
                        )
                      })}
                    </div>
                  )}

                  <Alert closable>
                    <Trans>
                      If you just came to know about a recent incident of{' '}
                      {projectOrProductName}, carefully read the cover rules
                      above. You can earn flat{' '}
                      {toBN(reporterCommission)
                        .multipliedBy(100)
                        .dividedBy(MULTIPLIER)
                        .toString()}
                      % of the minority fees if you are the first person to
                      report this incident.
                    </Trans>
                  </Alert>
                </div>
              </AcceptReportRulesForm>
            </div>
          </div>
          <CoverResolutionSources
            resolutionSources={resolutionSources || []}
            reportingPeriod={reportingPeriod}
          >
            {/* <Link href="#">
              <a className="block mt-3 text-4E7DD9 hover:underline">
                <Trans>Neptune Mutual Reporters</Trans>
              </a>
            </Link> */}
          </CoverResolutionSources>
        </Container>
      </div>
    </>
  )
}
