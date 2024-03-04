import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import { GovernanceModule } from '@/modules/governance/GovernanceModule'
import { isFeatureEnabled } from '@/src/config/environment'

import { slugToNetworkId } from '@/src/config/networks'
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
      networkId: slugToNetworkId[params.network]
    }
  }
}

export default function GovernanceIndexPage ({ networkId }) {
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
