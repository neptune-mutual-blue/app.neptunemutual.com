import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import { ViewProposals } from '@/modules/governance/view-proposals/ViewProposals'

export default function GovernanceIndexPage () {
  return (
    <main className='pb-32 pt-18' id='governance-page'>
      <Seo />
      <Container>
        <ViewProposals />
      </Container>
    </main>
  )
}
