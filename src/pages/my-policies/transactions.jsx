import { BreadCrumbs } from '@/common/BreadCrumbs/BreadCrumbs'
import { Container } from '@/common/Container/Container'
import { Hero } from '@/common/Hero'
import { HeroTitle } from '@/common/HeroTitle'
import { MyPoliciesTxsTable } from '@/src/modules/my-policies/MyPoliciesTxsTable'
import { ComingSoon } from '@/common/ComingSoon'
import { isFeatureEnabled } from '@/src/config/environment'
import { t, Trans } from '@lingui/macro'
import { Routes } from '@/src/config/routes'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { logPageLoad } from '@/src/services/logs'
import { useEffect } from 'react'
import { analyticsLogger } from '@/utils/logger'
import { Seo } from '@/common/Seo'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('policy')
    }
  }
}

export default function MyPoliciesTxs ({ disabled }) {
  const { account, chainId } = useWeb3React()
  const router = useRouter()

  useEffect(() => {
    analyticsLogger(() => logPageLoad(chainId ?? null, account ?? null, router.pathname))
  }, [account, chainId, router.pathname])

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />

      <Hero>
        <Container className='px-2 py-20'>
          <BreadCrumbs
            pages={[
              {
                name: t`My Policies`,
                href: Routes.MyActivePolicies,
                current: false
              },
              { name: t`Transaction List`, href: '#', current: true }
            ]}
          />

          <HeroTitle>
            <Trans>Transaction List</Trans>
          </HeroTitle>
        </Container>

        <hr className='border-B0C4DB' />
      </Hero>

      <Container className='pt-14 pb-28'>
        <MyPoliciesTxsTable />
      </Container>
    </main>
  )
}
