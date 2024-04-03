import { ComingSoon } from '@/common/ComingSoon'
import { Container } from '@/common/Container/Container'
import { Seo } from '@/common/Seo'
import { GovernanceModule } from '@/modules/governance/GovernanceModule'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { getTitle } from '@/src/ssg/seo'
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
      networkId: slugToNetworkId[params.network],
      title: getTitle({
        networkId: slugToNetworkId[params.network],
        pageAction: 'Governance on #NETWORK marketplace'
      })
    }
  }
}

export default function GovernanceIndexPage ({ networkId, title }) {
  const disabled = !isFeatureEnabled('governance', networkId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main className='pb-32 pt-18' id='governance-page'>
      <Seo title={title} />
      <Container>
        <GovernanceModule />
      </Container>
    </main>
  )
}
