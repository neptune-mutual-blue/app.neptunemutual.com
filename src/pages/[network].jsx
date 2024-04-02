import { Seo } from '@/common/Seo'
import HomePage from '@/modules/home'
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
      title: getTitle({ networkId: slugToNetworkId[params.network] })
    }
  }
}

export default function Home ({ networkId, title }) {
  return (
    <main>
      <Seo title={title} />
      <HomePage networkId={networkId} />
    </main>
  )
}
