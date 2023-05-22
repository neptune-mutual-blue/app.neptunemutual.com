import { BridgeOptions } from '@/modules/bridge/bridge-options/BridgeOptions'
import { useEffect, useState } from 'react'

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
  const [selectedBridge, setSelectedBridge] = useState('')

  useEffect(() => {
    setSelectedNetworks(prev => ({ ...prev, network2: null }))
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
    setSelectedNetworks
  }

  return (
    <Container className='pt-20 pb-72'>
      <div className='flex mx-auto bg-white border divide-x divide-B0C4DB border-B0C4DB rounded-2xl'>
        <CelerBridgeModule
          {...props}
          setInfoArray={(infoArray) => setInfoData(prev => ({ ...prev, celer: infoArray }))}
        />

        <LayerZeroBridgeModule
          {...props}
          setInfoArray={(infoArray) => setInfoData(prev => ({ ...prev, 'layer-zero': infoArray }))}
        />

        <BridgeOptions
          selectedBridge={selectedBridge}
          setSelectedBridge={setSelectedBridge}
          buttonText={buttonText}
          buttonDisabled={buttonDisabled}
          setBtnClickValue={setBtnClickValue}
          infoData={infoData}
        />
      </div>
    </Container>
  )
}

export { BridgeModule }
