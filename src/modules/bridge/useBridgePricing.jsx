import {
  useEffect,
  useState
} from 'react'

import { getBnbPrice } from '@/src/services/api/bridge/pricing/bnb'
import { getEthPrice } from '@/src/services/api/bridge/pricing/eth'
import { getNpmPrice } from '@/src/services/api/bridge/pricing/npm'
import { convertToUnits } from '@/utils/bn'

const defaultPrices = {
  NPM: convertToUnits('1', 18).toString(), // 18 decimals for uniswap pair
  ETH: convertToUnits('1', 18).toString(),
  BNB: convertToUnits('1', 18).toString()
}

export const useBridgePricing = () => {
  const [conversionRates, setConversionRates] = useState(defaultPrices)

  useEffect(() => {
    const makeCalls = async function () {
      try {
        const [ethPrice, bnbPrice, npmPrice] = await Promise.all([
          getEthPrice(),
          getBnbPrice(),
          getNpmPrice()
        ])

        setConversionRates({
          ETH: ethPrice || defaultPrices.ETH,
          BNB: bnbPrice || defaultPrices.BNB,
          NPM: npmPrice || defaultPrices.NPM
        })
      } catch (e) {
        console.error('Error in fetching bridge price')
      }
    }

    makeCalls()
  }, [])

  return conversionRates
}
