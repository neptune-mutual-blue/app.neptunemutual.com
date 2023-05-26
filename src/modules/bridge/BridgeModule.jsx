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
import { networks } from '@/src/config/networks'
import { useNetwork } from '@/src/context/Network'
import {
  convertToUnits,
  toBNSafe
} from '@/utils/bn'
import { getNetworkInfo } from '@/utils/network'
import { useWeb3React } from '@web3-react/core'

const BridgeModule = () => {
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const [sendAmount, setSendAmount] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
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

  useEffect(() => {
    const options = getNetworkInfo(networkId).isMainNet ? networks.mainnet : networks.testnet
    setSelectedNetworks((prev) => ({ ...prev, srcNetwork: options.find(x => x.chainId === parseInt(networkId)) }))
    // eslint-disable-next-line
  }, [networkId])

  useEffect(() => {
    setSelectedNetworks(prev => ({ ...prev, destNetwork: null }))
  }, [selectedBridge])

  const props = {
    selectedBridge,
    sendAmount,
    setSendAmount,
    receiverAddress: _receiverAddress,
    setReceiverAddress,
    selectedNetworks,
    setSelectedNetworks,
    conversionRates
  }

  return (
    <Container className='pt-20 pb-72'>
      <div className='flex flex-col mx-auto bg-white border lg:divide-x divide-B0C4DB border-B0C4DB rounded-2xl lg:flex-row'>
        <CelerBridgeModule
          {...props}
          celerHookResult={celerHookResult}
          setInfoArray={(infoArray) => setInfoData(prev => ({ ...prev, [BRIDGE_KEYS.CELER]: infoArray }))}
          setTotalPriceInUsd={price => setTotalPriceInUsd(prev => ({ ...prev, [BRIDGE_KEYS.CELER]: price }))}

        />

        <LayerZeroBridgeModule
          {...props}
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
              handleApprove={() => celerHookResult.handleApprove(
                convertToUnits(sendAmount, celerHookResult.sourceTokenDecimal).toString()
              )}
              handleBridge={() => celerHookResult.handleBridge(
                convertToUnits(sendAmount, celerHookResult.sourceTokenDecimal).toString(),
                selectedNetworks.destNetwork,
                _receiverAddress,
                celerHookResult.estimation.max_slippage
              )}
              canBridge={celerHookResult.canBridge}
              bridgeTokenSymbol={celerHookResult.tokenSymbol}
            />
          )}

          {selectedBridge === BRIDGE_KEYS.LAYERZERO && (
            <CommonBridgeActions
              disabled={layerZeroHookResult.buttonDisabled}
              approving={layerZeroHookResult.approving}
              bridging={layerZeroHookResult.bridging}
              handleApprove={() => layerZeroHookResult.handleApprove(
                convertToUnits(sendAmount, layerZeroHookResult.sourceTokenDecimal).toString()
              )}
              handleBridge={() => layerZeroHookResult.handleBridge(
                convertToUnits(sendAmount, layerZeroHookResult.sourceTokenDecimal).toString(),
                lzConfig.LayerZeroChainIds[destChainId],
                _receiverAddress
              )}
              canBridge={
            !toBNSafe(sendAmount).isZero() &&
            convertToUnits(sendAmount, layerZeroHookResult.sourceTokenDecimal)
              .isLessThanOrEqualTo(layerZeroHookResult.allowance)
          }
              bridgeTokenSymbol={layerZeroHookResult.tokenSymbol}
            />
          )}

        </BridgeOptions>
      </div>
    </Container>
  )
}

export { BridgeModule }
