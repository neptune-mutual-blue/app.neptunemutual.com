import { useCallback, useEffect, useState } from 'react'
import { t } from '@lingui/macro'
import { useWeb3React } from '@web3-react/core'

import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { ADDRESS_ONE, PoolTypes, POOL_INFO_URL } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'
import { useLingui } from '@lingui/react'

export const defaultInfo = {
  // From store
  stakingPoolsContractAddress: '',
  name: '',
  stakingToken: '',
  stakingTokenStablecoinPair: '',
  rewardToken: '',
  rewardTokenStablecoinPair: '',
  totalStaked: '0',
  target: '0',
  maximumStake: '0',
  stakeBalance: '0',
  cumulativeDeposits: '0',
  rewardPerBlock: '0',
  platformFee: '0',
  lockupPeriodInBlocks: '0',
  rewardTokenBalance: '0',
  myStake: '0',
  totalBlockSinceLastReward: '0',
  rewards: '0',
  canWithdrawFromBlockHeight: '0',
  lastDepositHeight: '0',
  lastRewardHeight: '0'
}

export const usePoolInfo = ({ key, type = PoolTypes.TOKEN }) => {
  const [info, setInfo] = useState(defaultInfo)

  const { account } = useWeb3React()
  const { networkId } = useNetwork()
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  const fetchPoolInfo = useCallback(async () => {
    if (!networkId || !key) {
      return
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not get pool info`)
    }

    try {
      const response = await fetch(
        getReplacedString(POOL_INFO_URL, {
          networkId,
          key,
          account: account || ADDRESS_ONE,
          type
        }),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          }
        }
      )

      const { data } = await response.json()

      return data
    } catch (err) {
      handleError(err)
    }
  }, [account, key, networkId, notifyError, type, i18n])

  useEffect(() => {
    let ignore = false

    fetchPoolInfo()
      .then((data) => {
        if (ignore || !data) {
          return
        }

        setInfo(data)
      })
      .catch(console.error)

    return () => {
      ignore = true
    }
  }, [fetchPoolInfo])

  const refetch = useCallback(() => {
    fetchPoolInfo()
      .then((data) => {
        if (!data) { return }

        setInfo(data)
      })
      .catch(console.error)
  }, [fetchPoolInfo])

  return { info, refetch }
}
