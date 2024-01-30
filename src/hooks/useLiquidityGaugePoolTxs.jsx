import {
  useEffect,
  useState
} from 'react'

import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import {
  getLgpTransactions
} from '@/src/services/api/liquidity-gauge-pools/transactions'
import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

export const useLiquidityGaugePoolTxs = () => {
  const { networkId } = useNetwork()
  const { account } = useWeb3React()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  useEffect(() => {
    async function exec () {
      if (!networkId || !account) {
        return
      }

      try {
        const _data = await getLgpTransactions(networkId, account)

        if (!_data) {
          return
        }

        setData(_data)
      } catch (err) {
        notifyError(err, t(i18n)`Could not get liquidity gauge pool transactions list`)
      }
    }

    setLoading(true)
    exec()
      .then(() => { return setLoading(false) })
      .catch(() => { return setLoading(false) })
  }, [notifyError, networkId, account, i18n])

  return {
    data,
    loading
  }
}
