import {
  useEffect,
  useState
} from 'react'

import { getBnbPrice } from '@/src/services/api/bridge/pricing/bnb'
import { getEthPrice } from '@/src/services/api/bridge/pricing/eth'
import { getNpmPrice } from '@/src/services/api/bridge/pricing/npm'
import { convertToUnits } from '@/utils/bn'
import { useNetwork } from '@/src/context/Network'
import { getNetworkInfo } from '@/utils/network'

const defaultPrices = {
  NPM: convertToUnits('1', 18).toString(), // 18 decimals for uniswap pair
  ETH: convertToUnits('1', 18).toString(),
  BNB: convertToUnits('1', 18).toString()
}

export const useBridgePricing = () => {
  const [conversionRates, setConversionRates] = useState(defaultPrices)
  const { networkId } = useNetwork()

  useEffect(() => {
    if (!networkId) { return }

    const { isBinanceSmartChain } = getNetworkInfo(networkId)

    const makeCalls = async function () {
      try {
        const [ethPrice, npmPrice, bnbPrice] = await Promise.all([
          !isBinanceSmartChain && getEthPrice(),
          getNpmPrice(),
          isBinanceSmartChain && getBnbPrice()
        ])

        setConversionRates({
          ETH: ethPrice || defaultPrices.ETH,
          NPM: npmPrice || defaultPrices.NPM,
          BNB: bnbPrice || defaultPrices.BNB
        })
      } catch (e) {
        console.error('Error in fetching bridge price:', e)
      }
    }

    makeCalls()
  }, [networkId])

  return conversionRates
}
