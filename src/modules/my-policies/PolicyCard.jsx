import {
  Badge,
  E_CARD_STATUS,
  identifyStatus
} from '@/common/CardStatusBadge'
import { InfoTooltip } from '@/common/Cover/InfoTooltip'
import { CoverAvatar } from '@/common/CoverAvatar'
import { Divider } from '@/common/Divider/Divider'
import { OutlinedCard } from '@/common/OutlinedCard/OutlinedCard'
import DateLib from '@/lib/date/DateLib'
import { CoverStatus } from '@/src/config/constants'
import {
  getCoverImgSrc,
  isValidProduct
} from '@/src/helpers/cover'
import { PolicyCardFooter } from '@/src/modules/my-policies/PolicyCardFooter'
import { isGreater } from '@/utils/bn'

export const PolicyCard = ({ policyInfo, coverOrProductData }) => {
  const coverKey = policyInfo.coverKey
  const productKey = policyInfo.productKey
  const isDiversified = isValidProduct(productKey)

  const projectOrProductName = isDiversified ? coverOrProductData?.productInfoDetails?.productName : coverOrProductData?.coverInfoDetails.coverName || coverOrProductData?.coverInfoDetails.projectName
  const validityEndsAt = policyInfo.expiresOn || DateLib.unix().toString()

  const status = CoverStatus[policyInfo.productStatus]
  const _status = identifyStatus(status)

  const now = DateLib.unix()

  const isPolicyExpired = isGreater(now, validityEndsAt)
  const isClaimable = policyInfo.productStatusEnum === 'Claimable'
  const isClaimStarted = policyInfo.claimBeginsFrom && isGreater(now, policyInfo.claimBeginsFrom)
  const isClaimExpired = policyInfo.claimExpiresAt && isGreater(now, policyInfo.claimExpiresAt)

  // If status is "Claimable" then show status only during claim period
  const withinClaimPeriod = isClaimable && isClaimStarted && !isClaimExpired

  const beforeResolutionDeadline = isClaimable && !isClaimStarted

  return (
    <div
      className='rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4E7DD9'
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
                  {withinClaimPeriod && _status !== E_CARD_STATUS.NORMAL && (
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
          isPolicyExpired={isPolicyExpired}
          beforeResolutionDeadline={beforeResolutionDeadline}
          withinClaimPeriod={withinClaimPeriod}
          isClaimable={isClaimable}
          claimBeginsFrom={policyInfo.claimBeginsFrom}
          claimExpiresAt={policyInfo.claimExpiresAt}
          incidentDate={policyInfo.incidentDate}
          amountToCover={policyInfo.amount || '0'}
          validityEndsAt={validityEndsAt}
        />
      </OutlinedCard>
    </div>
  )
}
