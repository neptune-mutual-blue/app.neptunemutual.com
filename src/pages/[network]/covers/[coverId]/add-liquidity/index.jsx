
import { ComingSoon } from '@/common/ComingSoon'
import {
  LiquidityFormsProvider
} from '@/common/LiquidityForms/LiquidityFormsContext'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { CoverAddLiquidityDetailsPage } from '@/src/modules/cover/add-liquidity'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { slugToNetworkId } from '@/src/config/networks'
import { getNetworksAndCovers } from '@/src/ssg/static-paths'

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
      disabled: !isFeatureEnabled('liquidity', slugToNetworkId[params.network])
    }
  }
}

export default function CoverAddLiquidityDetails ({ disabled, coverId }) {
  const coverKey = safeFormatBytes32String(coverId)

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <>
      <Seo />

      <LiquidityFormsProvider coverKey={coverKey}>
        <CoverAddLiquidityDetailsPage />
      </LiquidityFormsProvider>

    </>
  )
}
