import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import {
  PoliciesActivePage
} from '@/src/modules/my-policies/active/PoliciesActivePage'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('policy')
    }
  }
}

export default function MyPoliciesActive ({ disabled }) {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <PoliciesTabs active='active'>
        {({ data, loading }) => (
          <PoliciesActivePage data={data} loading={loading} />
        )}
      </PoliciesTabs>
    </main>
  )
}
