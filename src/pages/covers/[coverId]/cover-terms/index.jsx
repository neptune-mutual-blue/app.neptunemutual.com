import Head from 'next/head'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { DedicatedCoverTermsPage } from '@/modules/cover/cover-terms/DedicatedCoverTermsPage'
import { DiversifiedCoverTermsPage } from '@/modules/cover/cover-terms/DiversifiedCoverTermsPage'

export default function CoverPage () {
  const router = useRouter()
  const { coverId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String('')

  const coverInfo = useCoverOrProductData({ coverKey, productKey })

  const isDiversified = coverInfo?.supportsProducts

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>

      <div className='px-8 pt-8 bg-white md:pt-14 sm:px-12 md:px-20 lg:px-36 xl:px-56 font-sora pb-14 text-000000'>
        {
          isDiversified
            ? <DiversifiedCoverTermsPage coverInfo={coverInfo} />
            : <DedicatedCoverTermsPage coverInfo={coverInfo} />
        }
      </div>

    </main>
  )
}

/* istanbul ignore next */
export const getServerSideProps = async () => {
  return {
    props: {
      noHeader: true
    }
  }
}
