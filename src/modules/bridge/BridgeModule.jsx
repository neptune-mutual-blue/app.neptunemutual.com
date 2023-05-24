import {
  useEffect,
  useState
} from 'react'

import { BridgeOptions } from '@/modules/bridge/bridge-options/BridgeOptions'
import {
  BRIDGE_ETH_PRICING_URL,
  BRIDGE_NPM_PRICING_URL
} from '@/src/config/constants'

const { Container } = require('@/common/Container/Container')
const { CelerBridgeModule } = require('@/modules/bridge/bridge-form/CelerBridgeModule')
const { LayerZeroBridgeModule } = require('@/modules/bridge/bridge-form/LayerZeroBridgeModule')

const BridgeModule = () => {
  const [buttonText, setButtonText] = useState('Select Bridge')
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [btnClickValue, setBtnClickValue] = useState(0)
  const [infoData, setInfoData] = useState({ celer: [], 'layer-zero': [] })

  const [sendAmount, setSendAmount] = useState('')
  const [receiverAddress, setReceiverAddress] = useState('')
  const [selectedNetworks, setSelectedNetworks] = useState({
    network1: null,
    network2: null
  })
  const [selectedBridge, setSelectedBridge] = useState('layer-zero')

  const [conversionRates, setConversionRates] = useState({ NPM: '1', ETH: '1' })
  const [totalPriceInUsd, setTotalPriceInUsd] = useState({ celer: '0', 'layer-zero': '0' })
  const [celerDelay, setCelerDelay] = useState('0')

  useEffect(() => {
    const makeCalls = async () => {
      try {
        const requests = [
          fetch(BRIDGE_ETH_PRICING_URL),
          fetch(BRIDGE_NPM_PRICING_URL)
        ]
        const [ethResponse, npmResponse] = await Promise.all(requests)
        const [ethData, npmData] = await Promise.all([ethResponse.json(), npmResponse.json()])

        setConversionRates({ ETH: ethData.data || '1', NPM: npmData.data || '1' })
      } catch (e) {
        console.error('Error in fetching bridge price')
      }
    }

    makeCalls()
  }, [])

  useEffect(() => {
    setSelectedNetworks(prev => ({ ...prev, network2: null }))
    setBtnClickValue(0)
  }, [selectedBridge])

  const props = {
    setButtonText,
    setButtonDisabled,
    btnClickValue,
    selectedBridge,
    sendAmount,
    setSendAmount,
    receiverAddress,
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
          setInfoArray={(infoArray) => setInfoData(prev => ({ ...prev, celer: infoArray }))}
          setTotalPriceInUsd={price => setTotalPriceInUsd(prev => ({ ...prev, celer: price }))}
          setDelayPeriod={(delay) => setCelerDelay(delay)}
        />

        <LayerZeroBridgeModule
          {...props}
          setInfoArray={(infoArray) => setInfoData(prev => ({ ...prev, 'layer-zero': infoArray }))}
          setTotalPriceInUsd={price => setTotalPriceInUsd(prev => ({ ...prev, 'layer-zero': price }))}
        />

        <BridgeOptions
          selectedBridge={selectedBridge}
          setSelectedBridge={setSelectedBridge}
          buttonText={buttonText}
          buttonDisabled={buttonDisabled}
          setBtnClickValue={setBtnClickValue}
          infoData={infoData}
          totalPriceInUsd={totalPriceInUsd}
          celerDelay={celerDelay}
        />
      </div>
    </Container>
  )
}

export { BridgeModule }
