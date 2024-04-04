import { Seo } from '@/common/Seo'
import HomePage from '@/modules/home'
import { DEFAULT_NETWORK } from '@/src/config/constants'
import { getTitle } from '@/src/ssg/seo'

export const getStaticProps = async () => {
  return {
    props: {
      networkId: DEFAULT_NETWORK,
      title: getTitle({
        networkId: 1,
        pageAction: 'Neptune Mutual #NETWORK marketplace'
      })
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
