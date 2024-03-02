import { ComingSoon } from '@/common/ComingSoon'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import BondPage from '@/src/modules/pools/bond'
import { PoolsTabs } from '@/src/modules/pools/PoolsTabs'

export default function Bond () {
  const { networkId } = useNetwork()

  const disabled = !isFeatureEnabled('bond', networkId)
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
