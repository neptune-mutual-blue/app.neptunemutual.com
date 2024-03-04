import { useRouter } from 'next/router'

import { ComingSoon } from '@/common/ComingSoon'
import {
  LiquidityFormsProvider
} from '@/common/LiquidityForms/LiquidityFormsContext'
import { Seo } from '@/common/Seo'
import { isFeatureEnabled } from '@/src/config/environment'
import { ProvideLiquidityToCover } from '@/src/modules/my-liquidity/details'
import { safeFormatBytes32String } from '@/utils/formatter/bytes32String'
import { useNetwork } from '@/src/context/Network'

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
      coverId: params.coverId
    }
  }
}

export default function MyLiquidityCover () {
  const { networkId } = useNetwork()
  const disabled = !isFeatureEnabled('liquidity', networkId)
  const router = useRouter()
  const { coverId } = router.query
  const coverKey = safeFormatBytes32String(coverId)
  const productKey = safeFormatBytes32String('')

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />

      <LiquidityFormsProvider coverKey={coverKey}>
        <ProvideLiquidityToCover
          coverKey={coverKey}
          productKey={productKey}
        />
      </LiquidityFormsProvider>
    </main>
  )
}
