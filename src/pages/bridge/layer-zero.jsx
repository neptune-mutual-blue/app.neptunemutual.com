import { useMemo } from 'react'

import { Seo } from '@/common/Seo'
import { LayerZeroBridgeModule } from '@/modules/bridge/bridge-form/LayerZeroBridgeModule'
import { BridgeSwitch } from '@/modules/bridge/bridge-form/BridgeSwitch'
import { networks } from '@/src/config/networks'

import * as lzConfig from '@/src/config/bridge/layer-zero'
import { useNetwork } from '@/src/context/Network'
import { getNetworkInfo } from '@/utils/network'
import { isFeatureEnabled } from '@/src/config/environment'
import { ComingSoon } from '@/common/ComingSoon'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('bridge-layerzero'),
      bothBridgesEnabled: isFeatureEnabled('bridge-celer') && isFeatureEnabled('bridge-layerzero')
    }
  }
}

export default function LayerZeroBridgePage ({ disabled, bothBridgesEnabled }) {
  const { networkId } = useNetwork()
  const { isTestNet } = getNetworkInfo(networkId)

  const tokenData = isTestNet ? lzConfig.TESTNET_TOKENS : lzConfig.MAINNET_TOKENS
  const tokenSymbol = 'NPM'

  const filteredNetworks = useMemo(() => {
    const _networks = isTestNet ? networks.testnet : networks.mainnet
    const filtered = _networks
      .filter(n => Object.keys(tokenData).includes(n.chainId.toString())) // filtered based on availability of tokens

    return filtered
  }, [isTestNet, tokenData])

  if (disabled) {
    return <ComingSoon />
  }

  return (
    <main>
      <Seo />

      {bothBridgesEnabled ? <BridgeSwitch value='layer-zero' /> : <br />}

      <LayerZeroBridgeModule
        filteredNetworks={filteredNetworks}
        tokenData={tokenData}
        tokenSymbol={tokenSymbol}
        bridgeContractAddress={lzConfig.BRIDGE_CONTRACTS[networkId]}
      />
    </main>
  )
}
