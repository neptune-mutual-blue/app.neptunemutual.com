import { Seo } from '@/common/Seo'
import HomePage from '@/modules/home'

export const getStaticProps = async () => {
  return {
    props: {
      networkId: 1
    }
  }
}

export default function Home () {
  return (
    <main>
      <Seo />
      <HomePage />

    </main>
  )
}
