import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import {
  PoliciesExpiredPage
} from '@/src/modules/my-policies/expired/PoliciesExpiredPage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'

export default function MyPoliciesExpired () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('policy', networkId)
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <PoliciesTabs active='expired'>
        <PoliciesExpiredPage />
      </PoliciesTabs>
    </main>
  )
}
