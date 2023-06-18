import {
  useEffect,
  useState
} from 'react'

import {
  BRIDGE_BNB_PRICING_URL,
  BRIDGE_ETH_PRICING_URL,
  BRIDGE_NPM_PRICING_URL
} from '@/src/config/constants'
import { convertToUnits } from '@/utils/bn'

export const useBridgePricing = () => {
  const [conversionRates, setConversionRates] = useState({
    NPM: convertToUnits('1', 18), // 18 decimals for uniswap pair
    ETH: convertToUnits('1', 18),
    BNB: convertToUnits('1', 18)
  })

  useEffect(() => {
    const makeCalls = async () => {
      try {
        const requests = [
          fetch(BRIDGE_ETH_PRICING_URL),
          fetch(BRIDGE_BNB_PRICING_URL),
          fetch(BRIDGE_NPM_PRICING_URL)
        ]
        const [ethResponse, bnbResponse, npmResponse] = await Promise.all(requests)
        const [ethData, bnbData, npmData] = await Promise.all([ethResponse.json(), bnbResponse.json(), npmResponse.json()])

        setConversionRates({ ETH: ethData.data || '1', BNB: bnbData.data || '1', NPM: npmData.data || '1' })
      } catch (e) {
        console.error('Error in fetching bridge price')
      }
    }

    makeCalls()
  }, [])

  return conversionRates
}
