import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import {
  getCelerTransferConfigs
} from '@/src/services/celer/getCelerTransferConfig'
import { getNetworkInfo } from '@/utils/network'

export const useCelerTransferConfigs = () => {
  const [data, setData] = useState({
    tokenData: null,
    bridgeContractAddress: null
  })

  const { networkId } = useNetwork()

  const { isTestNet } = getNetworkInfo(networkId)
  const tokenSymbol = isTestNet ? 'USDC' : 'NPM'

  useEffect(() => {
    getCelerTransferConfigs(networkId, tokenSymbol)
      .then((data) => {
        setData({
          tokenData: data.bridgeTokens,
          bridgeContractAddress: data.bridgeContracts[networkId]
        })
      })
      .catch(console.error)
  }, [networkId, tokenSymbol])

  return {
    tokenSymbol,
    tokenData: data.tokenData,
    bridgeContractAddress: data.bridgeContractAddress
  }
}
