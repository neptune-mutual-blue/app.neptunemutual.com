import Head from 'next/head'
import { PoliciesTabs } from '@/src/modules/my-policies/PoliciesTabs'
import { PoliciesActivePage } from '@/src/modules/my-policies/active/PoliciesActivePage'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { logPageLoad } from '@/src/services/logs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('policy')
    }
  }
}

export default function MyPoliciesActive ({ disabled }) {
  const { account } = useWeb3React()
  const router = useRouter()

  logPageLoad(account ?? null, router.pathname)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>
      <PoliciesTabs active='active'>
        {({ data, loading }) => (
          <PoliciesActivePage data={data} loading={loading} />
        )}
      </PoliciesTabs>
    </main>
  )
}
