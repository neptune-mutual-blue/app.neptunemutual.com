import {
  useEffect,
  useState
} from 'react'

import {
  BRIDGE_ETH_PRICING_URL,
  BRIDGE_NPM_PRICING_URL
} from '@/src/config/constants'

export const useBridgePricing = () => {
  const [conversionRates, setConversionRates] = useState({ NPM: '1', ETH: '1' })

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

  return conversionRates
}
