import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import { GovernanceModule } from '@/modules/governance/GovernanceModule'
import { isFeatureEnabled } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'

export default function GovernanceIndexPage () {
  const { networkId } = useNetwork()

  const disabled = !isFeatureEnabled('governance', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main className='pb-32 pt-18' id='governance-page'>
      <Seo />
      <Container>
        <GovernanceModule />
      </Container>
    </main>
  )
}
