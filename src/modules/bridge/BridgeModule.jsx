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
import * as lzConfig from '@/src/config/bridge/layer-zero'
import { isFeatureEnabled } from '@/src/config/environment'
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import { useMountedState } from '@/src/hooks/useMountedState'
import { getNetworkInfo } from '@/utils/network'
import { useWeb3React } from '@web3-react/core'

const isCelerBridgeEnabled = isFeatureEnabled('bridge-celer')
const isLayerZeroBridgeEnabled = isFeatureEnabled('bridge-layerzero')
const DEFAULT_BRIDGE = isLayerZeroBridgeEnabled ? BRIDGE_KEYS.LAYERZERO : BRIDGE_KEYS.CELER

const BridgeModule = () => {
  const isMounted = useMountedState()
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const receiverAddress = ''
  const [sendAmount, setSendAmount] = useState('')
  const [selectedBridge, setSelectedBridge] = useState(DEFAULT_BRIDGE)
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

  const isCelerBridgeAvailable = !!celerHookResult.tokenData && !!celerHookResult.bridgeContractAddress && !!celerHookResult.tokenData[destChainId]

  // Resets source chain
  useEffect(() => {
    const options = getNetworkInfo(networkId).isMainNet ? networks.mainnet : networks.testnet
    setSelectedNetworks((prev) => { return { ...prev, srcNetwork: options.find(x => { return x.chainId === parseInt(networkId) }) } })
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
      tokenData = celerHookResult.tokenData
    }

    if (!tokenData) {
      return
    }

    const filtered = _networks
      .filter(n => { return Object.keys(tokenData).includes(n.chainId.toString()) }) // filtered based on availability of tokens

    if (!filtered || filtered.length === 0) {
      return
    }

    const firstDestOption = filtered.filter(n => { return n.chainId.toString() !== (networkId || '').toString() })[0]

    if (!firstDestOption) {
      return
    }

    // used for avoiding unnecessary re-renders
    setSelectedNetworks(prev => { return { ...prev, destNetwork: firstDestOption } })
  }, [networkId, selectedBridge, celerHookResult.tokenData])

  if (!isMounted()) {
    return null
  }

  return (
    <Container className='pt-20 pb-72'>
      <div className='flex flex-col mx-auto bg-white border lg:divide-x divide-B0C4DB border-B0C4DB rounded-2xl lg:flex-row'>
        {
          isCelerBridgeEnabled && isCelerBridgeAvailable && (
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
              setInfoArray={(infoArray) => { return setInfoData(prev => { return { ...prev, [BRIDGE_KEYS.CELER]: infoArray } }) }}
              setTotalPriceInUsd={price => { return setTotalPriceInUsd(prev => { return { ...prev, [BRIDGE_KEYS.CELER]: price } }) }}
            />
          )
        }

        {isLayerZeroBridgeEnabled && (
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
            setInfoArray={(infoArray) => { return setInfoData(prev => { return { ...prev, [BRIDGE_KEYS.LAYERZERO]: infoArray } }) }}
            setTotalPriceInUsd={price => { return setTotalPriceInUsd(prev => { return { ...prev, [BRIDGE_KEYS.LAYERZERO]: price } }) }}
          />
        )}

        <BridgeOptions
          isCelerBridgeEnabled={isCelerBridgeEnabled}
          isLayerZeroBridgeEnabled={isLayerZeroBridgeEnabled}
          isCelerBridgeAvailable={isCelerBridgeAvailable}
          celerDelay={celerHookResult.delayPeriod}
          selectedBridge={selectedBridge}
          setSelectedBridge={setSelectedBridge}
          infoData={infoData}
          totalPriceInUsd={totalPriceInUsd}
        >

          {selectedBridge === BRIDGE_KEYS.CELER && (
            <CommonBridgeActions
              disabled={celerHookResult.buttonDisabled}
              approving={celerHookResult.approving}
              bridging={celerHookResult.bridging}
              handleApprove={() => { return celerHookResult.handleApprove() }}
              handleBridge={() => { return celerHookResult.handleBridge() }}
              canBridge={celerHookResult.canBridge}
              bridgeTokenSymbol={celerHookResult.tokenSymbol}
            />
          )}

          {selectedBridge === BRIDGE_KEYS.LAYERZERO && (
            <CommonBridgeActions
              disabled={layerZeroHookResult.buttonDisabled}
              approving={layerZeroHookResult.approving}
              bridging={layerZeroHookResult.bridging}
              handleApprove={() => { return layerZeroHookResult.handleApprove() }}
              handleBridge={() => { return layerZeroHookResult.handleBridge() }}
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
