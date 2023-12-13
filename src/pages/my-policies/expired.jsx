import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import {
  PoliciesExpiredPage
} from '@/src/modules/my-policies/expired/PoliciesExpiredPage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('policy')
    }
  }
}

export default function MyPoliciesExpired ({ disabled }) {
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
