import {
  useEffect,
  useState
} from 'react'

import { GCR_POOLS_URL } from '@/src/config/constants'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { getReplacedString } from '@/utils/string'
import { t } from '@lingui/macro'

export const useLiquidityGaugePools = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  useEffect(() => {
    async function fetchPools () {
      const handleError = (err) => {
        notifyError(err, t`Could not get liquidity gauge pools`)
      }

      try {
        // Get data from API if wallet's not connected
        const response = await fetch(
          getReplacedString(GCR_POOLS_URL),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            }
          }
        )

        if (!response.ok) {
          return
        }

        const pools = (await response.json()).data

        if (!pools || Object.keys(pools).length === 0) {
          return
        }

        setData(pools)
      } catch (err) {
        handleError(err)
      }
    }

    setLoading(true)
    fetchPools()
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [notifyError])

  return {
    data,
    loading
  }
}
