import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import {
  PoliciesExpiredPage
} from '@/src/modules/my-policies/expired/PoliciesExpiredPage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'
import { getTitle } from '@/src/ssg/seo'
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
      networkId: slugToNetworkId[params.network],
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        pageAction: 'My Expired Policies on #NETWORK marketplace'
      })
    }
  }
}

export default function MyPoliciesExpired ({ networkId, title }) {
  const disabled = !isFeatureEnabled('policy', networkId)
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={title} />
      <PoliciesTabs active='expired'>
        <PoliciesExpiredPage />
      </PoliciesTabs>
    </main>
  )
}
