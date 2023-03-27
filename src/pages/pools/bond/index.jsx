import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import BondPage from '@/src/modules/pools/bond'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('bond')
    }
  }
}

export default function Bond ({ disabled }) {
  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />
      <PoolsTabs active='bond'>
        <BondPage />
      </PoolsTabs>
    </main>
  )
}
