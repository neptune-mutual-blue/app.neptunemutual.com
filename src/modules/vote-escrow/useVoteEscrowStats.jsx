import {
  useEffect,
  useState
} from 'react'

import { VOTE_ESCROW_STATS_URL } from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { getReplacedString } from '@/utils/string'
import { t } from '@lingui/macro'

export const useVoteEscrowStats = () => {
  const { networkId } = useNetwork()
  const [data, setData] = useState({
    averageLock: '0',
    totalVoteLocked: '0'
  })
  const [loading, setLoading] = useState(false)
  const { notifyError } = useErrorNotifier()

  useEffect(() => {
    async function exec () {
      if (!networkId) {
        return
      }

      const handleError = (err) => {
        notifyError(err, t`Could not get vote-escrow stats`)
      }

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

        setData(_data[0])
      } catch (err) {
        handleError(err)
      }
    }

    setLoading(true)
    exec()
      .then(() => setLoading(false))
      .catch(() => setLoading(false))
  }, [notifyError, networkId])

  return {
    data,
    loading
  }
}
