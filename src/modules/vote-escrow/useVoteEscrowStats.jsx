import {
  useEffect,
  useState
} from 'react'

import { VOTE_ESCROW_STATS_URL } from '@/src/config/constants'
import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { convertToUnits } from '@/utils/bn'
import { getReplacedString } from '@/utils/string'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'

export const useVoteEscrowStats = () => {
  const { networkId } = useNetwork()
  const [data, setData] = useState({
    averageLock: '0',
    totalVoteLocked: '0'
  })
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  useEffect(() => {
    async function exec () {
      if (!networkId) {
        return
      }

      const handleError = (err) => {
        notifyError(err, t(i18n)`Could not get vote-escrow stats`)
      }

      const NPMTokenDecimals = ChainConfig[networkId].npm.tokenDecimals

      try {
        // Get data from API if wallet's not connected
        const response = await fetch(
          getReplacedString(VOTE_ESCROW_STATS_URL, { networkId }),
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

        const stats = _data[0]

        setData({
          averageLock: stats.averageLock,
          totalVoteLocked: convertToUnits(stats.totalVoteLocked || '0', NPMTokenDecimals).toString()
        })
      } catch (err) {
        handleError(err)
      }
    }

    setLoading(true)
    exec()
      .then(() => { return setLoading(false) })
      .catch(() => { return setLoading(false) })
  }, [notifyError, networkId, i18n])

  return {
    data,
    loading
  }
}
