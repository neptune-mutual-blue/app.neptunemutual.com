import {
  useEffect,
  useState
} from 'react'

import { Container } from '@/common/Container/Container'
import {
  CelerBridgeModule
} from '@/modules/bridge/bridge-form/CelerBridgeModule'
import {
  LayerZeroBridgeModule
} from '@/modules/bridge/bridge-form/LayerZeroBridgeModule'
import { BridgeOptions } from '@/modules/bridge/bridge-options/BridgeOptions'
import { CommonBridgeActions } from '@/modules/bridge/CommonBridgeActions'
import { useBridgePricing } from '@/modules/bridge/useBridgePricing'
import { useCelerBridge } from '@/modules/bridge/useCelerBridge'
import { useLayerZeroBridge } from '@/modules/bridge/useLayerZeroBridge'
import { BRIDGE_KEYS } from '@/src/config/bridge'
import * as celerConfig from '@/src/config/bridge/celer'
import * as lzConfig from '@/src/config/bridge/layer-zero'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { getNetworkInfo } from '@/utils/network'
import { useWeb3React } from '@web3-react/core'

const BridgeModule = () => {
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const [sendAmount, setSendAmount] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [receiverAddress, _setReceiverAddress] = useState('')
  const [selectedBridge, setSelectedBridge] = useState(BRIDGE_KEYS.LAYERZERO)
  const [selectedNetworks, setSelectedNetworks] = useState({
    srcNetwork: null,
    destNetwork: null
  })

  const [infoData, setInfoData] = useState({
    [BRIDGE_KEYS.CELER]: [],
    [BRIDGE_KEYS.LAYERZERO]: []
  })
  const [totalPriceInUsd, setTotalPriceInUsd] = useState({
    [BRIDGE_KEYS.CELER]: '0',
    [BRIDGE_KEYS.LAYERZERO]: '0'
  })

  const srcChainId = selectedNetworks?.srcNetwork?.chainId
  const destChainId = selectedNetworks?.destNetwork?.chainId
  const _receiverAddress = receiverAddress || account

  const layerZeroHookResult = useLayerZeroBridge({
    destChainId,
    sendAmount,
    receiverAddress: _receiverAddress
  })

  const celerHookResult = useCelerBridge({
    srcChainId,
    destChainId,
    sendAmount,
    receiverAddress: _receiverAddress
  })

  const conversionRates = useBridgePricing()

  // Resets source chain
  useEffect(() => {
    const options = getNetworkInfo(networkId).isMainNet ? networks.mainnet : networks.testnet
    setSelectedNetworks((prev) => ({ ...prev, srcNetwork: options.find(x => x.chainId === parseInt(networkId)) }))
  }, [networkId])

  // Resets destination chain - used for avoiding unnecessary re-renders
  useEffect(() => {
    const { isTestNet } = getNetworkInfo(networkId)
    const _networks = isTestNet ? networks.testnet : networks.mainnet

    let tokenData = null

    if (selectedBridge === BRIDGE_KEYS.LAYERZERO) {
      tokenData = isTestNet ? lzConfig.TESTNET_TOKENS : lzConfig.MAINNET_TOKENS
    }

    if (selectedBridge === BRIDGE_KEYS.CELER) {
      tokenData = isTestNet ? celerConfig.TESTNET_USDC_BRIDGE_TOKENS : celerConfig.MAINNET_NPM_BRIDGE_TOKENS
    }

    if (!tokenData) {
      return
    }

    const filtered = _networks
      .filter(n => Object.keys(tokenData).includes(n.chainId.toString())) // filtered based on availability of tokens

    if (!filtered || filtered.length === 0) {
      return
    }

    const firstDestOption = filtered.filter(n => n.chainId.toString() !== networkId.toString())[0]

    if (!firstDestOption) {
      return
    }

    // used for avoiding unnecessary re-renders
    setSelectedNetworks(prev => ({ ...prev, destNetwork: firstDestOption }))
  }, [networkId, selectedBridge])

  return (
    <Container className='pt-20 pb-72'>
      <div className='flex flex-col mx-auto bg-white border lg:divide-x divide-B0C4DB border-B0C4DB rounded-2xl lg:flex-row'>
        <CelerBridgeModule
          // common props
          selectedBridge={selectedBridge}
          sendAmount={sendAmount}
          setSendAmount={setSendAmount}
          selectedNetworks={selectedNetworks}
          setSelectedNetworks={setSelectedNetworks}
          conversionRates={conversionRates}
          // receiverAddress={_receiverAddress}
          // setReceiverAddress={setReceiverAddress}
          // other props
          celerHookResult={celerHookResult}
          setInfoArray={(infoArray) => setInfoData(prev => ({ ...prev, [BRIDGE_KEYS.CELER]: infoArray }))}
          setTotalPriceInUsd={price => setTotalPriceInUsd(prev => ({ ...prev, [BRIDGE_KEYS.CELER]: price }))}

        />

        <LayerZeroBridgeModule
          // common props
          destChainId={destChainId}
          selectedBridge={selectedBridge}
          sendAmount={sendAmount}
          setSendAmount={setSendAmount}
          selectedNetworks={selectedNetworks}
          setSelectedNetworks={setSelectedNetworks}
          conversionRates={conversionRates}
          // receiverAddress={_receiverAddress}
          // setReceiverAddress={setReceiverAddress}
          // other props
          layerZeroHookResult={layerZeroHookResult}
          setInfoArray={(infoArray) => setInfoData(prev => ({ ...prev, [BRIDGE_KEYS.LAYERZERO]: infoArray }))}
          setTotalPriceInUsd={price => setTotalPriceInUsd(prev => ({ ...prev, [BRIDGE_KEYS.LAYERZERO]: price }))}
        />

        <BridgeOptions
          selectedBridge={selectedBridge}
          setSelectedBridge={setSelectedBridge}
          infoData={infoData}
          totalPriceInUsd={totalPriceInUsd}
          celerDelay={celerHookResult.delayPeriod}
        >

          {selectedBridge === BRIDGE_KEYS.CELER && (
            <CommonBridgeActions
              disabled={celerHookResult.buttonDisabled}
              approving={celerHookResult.approving}
              bridging={celerHookResult.bridging}
              handleApprove={() => celerHookResult.handleApprove()}
              handleBridge={() => celerHookResult.handleBridge()}
              canBridge={celerHookResult.canBridge}
              bridgeTokenSymbol={celerHookResult.tokenSymbol}
            />
          )}

          {selectedBridge === BRIDGE_KEYS.LAYERZERO && (
            <CommonBridgeActions
              disabled={layerZeroHookResult.buttonDisabled}
              approving={layerZeroHookResult.approving}
              bridging={layerZeroHookResult.bridging}
              handleApprove={() => layerZeroHookResult.handleApprove()}
              handleBridge={() => layerZeroHookResult.handleBridge()}
              canBridge={layerZeroHookResult.canBridge}
              bridgeTokenSymbol={layerZeroHookResult.tokenSymbol}
            />
          )}

        </BridgeOptions>
      </div>
    </Container>
  )
}

export { BridgeModule }
