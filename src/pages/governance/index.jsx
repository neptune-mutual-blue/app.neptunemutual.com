import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import { GovernanceModule } from '@/modules/governance/GovernanceModule'
import { isFeatureEnabled } from '@/src/config/environment'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('governance')
    }
  }
}

export default function GovernanceIndexPage ({ disabled }) {
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
