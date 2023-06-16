import {
  useEffect,
  useMemo,
  useState
} from 'react'

import { PRICING_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import {
  convertToUnits,
  toBN
} from '@/utils/bn'
import { getReplacedString } from '@/utils/string'

const AMOUNT = convertToUnits(1, 18).toString()

export const useLiquidityGaugePoolPricing = (tokenData = []) => {
  const [prices, setPrices] = useState({})
  const { networkId } = useNetwork()

  const payload = useMemo(() => {
    if (tokenData.find(token => { return !token.address })) {
      return []
    }

    const data = tokenData.map(token => {
      return {
        type: token.type,
        address: token.address,
        amount: AMOUNT
      }
    })

    return [{
      id: 'lgp',
      data
    }]
  }, [tokenData])

  useEffect(() => {
    if (payload.length === 0) {
      return
    }

    async function exec () {
      const ENDPOINT = getReplacedString(PRICING_URL, { networkId })

      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload),
        redirect: 'follow'
      })

      if (!response.ok) {
        return
      }

      const res = await response.json()

      const _prices = {}
      res.data.items[0].data.forEach(tokenPriceData => {
        _prices[tokenPriceData.address] = tokenPriceData.price
      })

      setPrices(_prices)
    }

    exec()
  }, [networkId, payload])

  const getPriceByToken = (tokenAddress) => {
    if (!prices[tokenAddress]) {
      return '0'
    }

    const pricePerUnit = toBN(prices[tokenAddress]).dividedBy(AMOUNT)

    return pricePerUnit
  }

  return {
    getPriceByToken
  }
}
