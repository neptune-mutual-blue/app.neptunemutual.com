import { PageNotFound } from '@/common/page-not-found'

export const getStaticProps = async () => {
  return {
    props: {
      networkId: 1
    }
  }
}

export default function NotFoundPage () {
  return <PageNotFound />
}
