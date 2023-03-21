import { Badge, E_CARD_STATUS, identifyStatus } from '@/common/CardStatusBadge'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { CoverAvatar } from '@/common/CoverAvatar'
import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import { CardSkeleton } from '@/common/Skeleton/CardSkeleton'
import DateLib from '@/lib/date/DateLib'
import { ReportStatus } from '@/src/config/constants'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { getCoverImgSrc, isValidProduct } from '@/src/helpers/cover'
import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { useFetchCoverStats } from '@/src/hooks/useFetchCoverStats'
import { useValidReport } from '@/src/hooks/useValidReport'
import { PolicyCardFooter } from '@/src/modules/my-policies/PolicyCardFooter'
import { isGreater } from '@/utils/bn'

export const PolicyCard = ({ policyInfo }) => {
  const { cxToken } = policyInfo
  const coverKey = policyInfo.coverKey
  const productKey = policyInfo.productKey
  const isDiversified = isValidProduct(productKey)

  const { loading, getProduct, getCoverByCoverKey } = useCoversAndProducts2()

  const coverOrProductData = isDiversified ? getProduct(coverKey, productKey) : getCoverByCoverKey(coverKey)
  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName

  const validityStartsAt = cxToken.creationDate || '0'
  const validityEndsAt = cxToken.expiryDate || '0'
  const { data: { report } } = useValidReport({
    start: validityStartsAt,
    end: validityEndsAt,
    coverKey,
    productKey
  })

  const { balance } = useERC20Balance(cxToken.id)
  const { info: { productStatus } } = useFetchCoverStats({ coverKey, productKey })

  if (loading) {
    return <CardSkeleton numberOfCards={1} />
  }

  const now = DateLib.unix()
  const isPolicyExpired = isGreater(now, validityEndsAt)

  let status = null
  let showStatus = true

  // If policy expired, show the last reporting status between `validityStartsAt` and `validityEndsAt`
  // else when policy is currently valid, show the current status of the cover
  // (no need to display anything if the status is normal)
  if (isPolicyExpired) {
    status = ReportStatus[report?.status]
  } else {
    status = productStatus

    const isClaimable = report ? report.status === 'Claimable' : false
    const isClaimStarted = report && isGreater(now, report.claimBeginsFrom)
    const isClaimExpired = report && isGreater(now, report.claimExpiresAt)

    // If status is "Claimable" then show status only during claim period
    showStatus = isClaimable ? isClaimStarted && !isClaimExpired : true
  }

  const _status = identifyStatus(status)

  return (
    <div
      className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9'
      data-testid='policy-card'
    >
      <OutlinedCard className='p-6 bg-white' type='normal'>
        <div>
          <div className='flex justify-between'>
            <CoverAvatar imgs={[{
              src: getCoverImgSrc({ key: isDiversified ? productKey : coverKey }),
              alt: projectOrProductName
            }]}
            />
            <div>
              <InfoTooltip
                disabled={!isDiversified}
                infoComponent={
                  <div>
                    Leverage Factor: <b>{coverOrProductData.leverage}x</b>
                    <p>Determines available capital to underwrite</p>
                  </div>
                }
              >
                <div data-testid='policy-card-status'>
                  {showStatus && _status !== E_CARD_STATUS.NORMAL && (
                    <Badge status={_status} className='rounded' />
                  )}
                </div>
              </InfoTooltip>
            </div>
          </div>
          <h4
            className='mt-4 text-lg font-semibold uppercase'
            data-testid='policy-card-title'
          >
            {projectOrProductName}
          </h4>
        </div>
        {/* Divider */}
        <Divider />
        <PolicyCardFooter
          coverKey={policyInfo.coverKey}
          productKey={policyInfo.productKey}
          cxToken={policyInfo.cxToken}
          report={report}
          tokenBalance={balance}
          validityEndsAt={validityEndsAt}
        />
      </OutlinedCard>
    </div>
  )
}
