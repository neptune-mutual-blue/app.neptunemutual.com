import {
  useEffect,
  useState
} from 'react'

import { LGP_TXS_URL } from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { convertToUnits } from '@/utils/bn'
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
          getReplacedString(LGP_TXS_URL, { networkId, account: account.toLowerCase() }),
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

        const txs = (await response.json()).data

        if (!txs || !Array.isArray(txs)) {
          return
        }

        setData(txs.map(tx => {
          // @todo: replace with backend response data
          const decimals = tx.event === 'Get Reward' ? ChainConfig[networkId].npm.tokenDecimals : ChainConfig[networkId].vaultTokenDecimals

          return {
            ...tx,
            amount: convertToUnits(tx.amount, decimals) // @todo: update with correct decimals
          }
        }))
      } catch (err) {
        handleError(err)
      }
    }

    setLoading(true)
    exec()
      .then(() => { return setLoading(false) })
      .catch(() => { return setLoading(false) })
  }, [notifyError, networkId, account])

  return {
    data,
    loading
  }
}
