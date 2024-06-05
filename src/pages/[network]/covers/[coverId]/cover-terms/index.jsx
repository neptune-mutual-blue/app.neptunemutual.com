import { Seo } from '@/common/Seo'
import {
  DiversifiedCoverTermsPage
} from '@/modules/cover/cover-terms/DiversifiedCoverTermsPage'
import {
  SingleCoverTermsPage
} from '@/modules/cover/cover-terms/SingleCoverTermsPage'
import { slugToNetworkId } from '@/src/config/networks'
import { useCoversAndProducts } from '@/src/context/CoversAndProductsData'
import {
  getDescription,
  getTitle
} from '@/src/ssg/seo'
import { getNetworksAndCovers } from '@/src/ssg/static-paths'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'

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
      coverId: params.coverId,
      seo: {
        title: getTitle({
          coverId: params.coverId,
          networkId: slugToNetworkId[params.network],
          pageAction: 'Cover Terms for #COVER on #NETWORK marketplace'
        }),
        description: getDescription(params.coverId, undefined, slugToNetworkId[params.network])
      }
    }
  }
}

export default function CoverTermsPage ({ seo, coverId }) {
  const { loading, getCoverByCoverKey, getProductsByCoverKey } = useCoversAndProducts()

  const coverKey = safeFormatBytes32String(coverId)

  const coverData = getCoverByCoverKey(coverKey)
  const isDiversified = coverData?.supportsProducts

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />

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
