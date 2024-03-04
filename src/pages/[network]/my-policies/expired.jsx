import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import {
  PoliciesExpiredPage
} from '@/src/modules/my-policies/expired/PoliciesExpiredPage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'

import { slugToNetworkId } from '@/src/config/networks'
import { getNetworks } from '@/src/ssg/static-paths'

export const getStaticPaths = async () => {
  return {
    paths: getNetworks(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network]
    }
  }
}

export default function MyPoliciesExpired ({ networkId }) {
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
