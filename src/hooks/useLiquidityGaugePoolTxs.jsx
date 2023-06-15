import {
  useEffect,
  useState
} from 'react'

import { LGP_TXS_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { getReplacedString } from '@/utils/string'
import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

export const useLiquidityGaugePoolTxs = () => {
  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  useEffect(() => {
    async function exec () {
      if (!networkId || !account) {
        return
      }

      const handleError = (err) => {
        notifyError(err, t`Could not get liquidity gauge pool transactions list`)
      }

      try {
        const response = await fetch(
          getReplacedString(LGP_TXS_URL, { networkId, account }),
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

        const _data = (await response.json()).data

        if (!_data || !Array.isArray(_data)) {
          return
        }

        setData(_data)
      } catch (err) {
        handleError(err)
      }
    }

    setLoading(true)
    exec()
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [notifyError, networkId, account])

  return {
    data,
    loading
  }
}
