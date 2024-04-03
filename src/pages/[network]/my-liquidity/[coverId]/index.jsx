import { ComingSoon } from '@/common/ComingSoon'
import {
  LiquidityFormsProvider
} from '@/common/LiquidityForms/LiquidityFormsContext'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { slugToNetworkId } from '@/src/config/networks'
import { ProvideLiquidityToCover } from '@/src/modules/my-liquidity/details'
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
      disabled: !isFeatureEnabled('liquidity', slugToNetworkId[params.network]),
      seo: {
        title: getTitle({
          coverId: params.coverId,
          networkId: slugToNetworkId[params.network],
          pageAction: 'Add Liquidity to #COVER on #NETWORK marketplace'
        }),
        description: getDescription(params.coverId, undefined, slugToNetworkId[params.network])
      }
    }
  }
}

export default function MyLiquidityCover ({ disabled, seo, coverId }) {
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String('')

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo title={seo.title} description={seo.description} />

      <LiquidityFormsProvider coverKey={coverKey}>
        <ProvideLiquidityToCover
          coverKey={coverKey}
          productKey={productKey}
        />
      </LiquidityFormsProvider>
    </main>
  )
}
