import { useMemo } from 'react'

import { Seo } from '@/common/Seo'
import { CelerBridgeModule } from '@/modules/bridge/CelerBridgeModule'
import { BridgeSwitch } from '@/modules/bridge/BridgeSwitch'
import { networks } from '@/src/config/networks'

import * as celerConfig from '@/src/config/bridge/celer'
import { useNetwork } from '@/src/context/Network'
import { getNetworkInfo } from '@/src/hooks/useValidateNetwork'
import { isFeatureEnabled } from '@/src/config/environment'
import { ComingSoon } from '@/common/ComingSoon'

/* istanbul ignore next */
export function getStaticProps () {
  return {
    props: {
      disabled: !isFeatureEnabled('bridge-celer'),
      bothBridgesEnabled: isFeatureEnabled('bridge-celer') && isFeatureEnabled('bridge-layerzero')
    }
  }
}

export default function CelerBridgePage ({ disabled, bothBridgesEnabled }) {
  const { networkId } = useNetwork()
  const { isTestNet } = getNetworkInfo(networkId)

  const tokenData = isTestNet ? celerConfig.TESTNET_USDT_BRIDGE_TOKENS : celerConfig.MAINNET_USDT_BRIDGE_TOKENS
  const tokenSymbol = 'USDT'

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

      {bothBridgesEnabled ? <BridgeSwitch value='celer' /> : <br />}

      <CelerBridgeModule
        filteredNetworks={filteredNetworks}
        tokenData={tokenData}
        tokenSymbol={tokenSymbol}
        bridgeContractAddress={celerConfig.BRIDGE_CONTRACTS[networkId]}
      />
    </main>
  )
}
