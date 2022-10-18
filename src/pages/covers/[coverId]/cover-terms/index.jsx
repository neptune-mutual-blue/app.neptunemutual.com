import Head from 'next/head'
import { useRouter } from 'next/router'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useCoverOrProductData } from '@/src/hooks/useCoverOrProductData'
import { isDiversifiedCoversEnabled } from '@/src/config/environment'
import { ComingSoon } from '@/common/ComingSoon'
import { DedicatedCoverTermsPage } from '@/modules/cover/cover-terms/DedicatedCoverTermsPage'
import { DiversifiedCoverTermsPage } from '@/modules/cover/cover-terms/DiversifiedCoverTermsPage'

const disabled = !isDiversifiedCoversEnabled()

export default function CoverPage () {
  const router = useRouter()
  const { coverId } = router.query

  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String('')

  const coverInfo = useCoverOrProductData({ coverKey, productKey })

  const isDiversified = coverInfo?.supportsProducts

  if (disabled && isDiversified) {
    return <ComingSoon />
  }

  return (
    <main>
      <Head>
        <title>Neptune Mutual Covers</title>
        <meta
          name='description'
          content='Get guaranteed payouts from our parametric cover model. Resolve incidents faster without the need for claims assessment.'
        />
      </Head>
      {
        isDiversified
          ? <DiversifiedCoverTermsPage coverInfo={coverInfo} />
          : <DedicatedCoverTermsPage coverInfo={coverInfo} />
      }

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
