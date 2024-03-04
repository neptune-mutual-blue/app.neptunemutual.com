import { useRouter } from 'next/router'

import { Seo } from '@/common/Seo'
import {
  DiversifiedCoverTermsPage
} from '@/modules/cover/cover-terms/DiversifiedCoverTermsPage'
import {
  SingleCoverTermsPage
} from '@/modules/cover/cover-terms/SingleCoverTermsPage'
import { useCoversAndProducts2 } from '@/src/context/CoversAndProductsData2'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { getNetworksAndCovers } from '@/src/ssg/static-paths'
import { slugToNetworkId } from '@/src/config/networks'

export const getStaticPaths = async () => {
  return {
    paths: getNetworksAndCovers(),
    fallback: false
  }
}

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      networkId: slugToNetworkId[params.network],
      coverId: params.coverId
    }
  }
}

export default function CoverTermsPage () {
  const router = useRouter()
  const { loading, getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts2()

  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)

  const coverData = getCoverByCoverKey(coverKey)
  const isDiversified = coverData?.supportsProducts

  return (
    <main>
      <Seo />

      <div className='px-8 pt-8 bg-white md:pt-14 sm:px-12 md:px-20 lg:px-36 xl:px-56 pb-14 text-000000'>
        {
          isDiversified
            ? <DiversifiedCoverTermsPage
                loading={loading}
                coverData={coverData}
                subProducts={getProductsByCoverKey(coverKey)}
              />
            : <SingleCoverTermsPage
                loading={loading}
                coverOrProductData={coverData}
              />
        }
      </div>
    </main>
  )
}
