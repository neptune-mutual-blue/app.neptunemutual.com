import {
  useEffect,
  useState
} from 'react'

import { GCR_POOLS_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const useLiquidityGaugePools = ({ NPMTokenDecimals }) => {
  const { networkId } = useNetwork()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  useEffect(() => {
    async function fetchPools () {
      if (!networkId) {
        return
      }

      const handleError = (err) => {
        notifyError(err, t(i18n)`Could not get liquidity gauge pools`)
      }

      try {
        // Get data from API if wallet's not connected
        const response = await fetch(
          getReplacedString(GCR_POOLS_URL, { networkId }),
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

        setData(pools.map(pool => {
          return {
            ...pool,
            currentDistribution: convertToUnits(pool.currentDistribution, NPMTokenDecimals).toString()
          }
        }))
      } catch (err) {
        handleError(err)
      }
    }

    setLoading(true)
    fetchPools()
      .then(() => { return setLoading(false) })
      .catch(() => { return setLoading(false) })
  }, [notifyError, networkId, NPMTokenDecimals, i18n])

  return {
    data,
    loading
  }
}
