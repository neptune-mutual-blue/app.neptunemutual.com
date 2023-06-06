import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import { GovernanceModule } from '@/modules/governance/GovernanceModule'

export default function GovernanceIndexPage () {
  return (
    <main className='pb-32 pt-18' id='governance-page'>
      <Seo />
      <Container>
        <GovernanceModule />
      </Container>
    </main>
  )
}
