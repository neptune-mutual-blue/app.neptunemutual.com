import {
  useCallback,
  useEffect,
  useState
} from 'react'

import {
  ADDRESS_ONE,
  UNSTAKE_INFO_URL
} from '@/src/config/constants'
import { useNetwork } from '@/src/context/Network'
import { getReplacedString } from '@/utils/string'
import { useWeb3React } from '@web3-react/core'

const defaultInfo = {
  yes: '0',
  no: '0',
  myYes: '0',
  myNo: '0',
  totalStakeInWinningCamp: '0',
  totalStakeInLosingCamp: '0',
  myStakeInWinningCamp: '0',
  unstaken: '0',
  latestIncidentDate: '0',
  burnRate: '0',
  reporterCommission: '0',
  allocatedReward: '0',
  toBurn: '0',
  toReporter: '0',
  myReward: '0',
  willReceive: '0'
}

export const useConsensusReportingInfo = ({
  coverKey,
  productKey,
  incidentDate
}) => {
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(defaultInfo)
  const { account } = useWeb3React()
  const { networkId } = useNetwork()

  const fetchInfo = useCallback(async () => {
    if (!networkId || !coverKey) {
      return
    }

    let data
    {
      // Get data from API if wallet's not connected
      const response = await fetch(
        getReplacedString(UNSTAKE_INFO_URL, {
          networkId,
          coverKey,
          productKey,
          account: account || ADDRESS_ONE,
          incidentDate
        }),
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

      const result = (await response.json())
      data = result.data
    }

    return {
      yes: data.yes || defaultInfo.yes,
      no: data.no || defaultInfo.no,
      myYes: data.myYes || defaultInfo.myYes,
      myNo: data.myNo || defaultInfo.myNo,
      totalStakeInWinningCamp: data.totalStakeInWinningCamp || defaultInfo.totalStakeInWinningCamp,
      totalStakeInLosingCamp: data.totalStakeInLosingCamp || defaultInfo.totalStakeInLosingCamp,
      myStakeInWinningCamp: data.myStakeInWinningCamp || defaultInfo.myStakeInWinningCamp,
      unstaken: data.unstaken || defaultInfo.unstaken,
      latestIncidentDate: data.latestIncidentDate || defaultInfo.latestIncidentDate,
      burnRate: data.burnRate || defaultInfo.burnRate,
      reporterCommission: data.reporterCommission || defaultInfo.reporterCommission,
      allocatedReward: data.allocatedReward || defaultInfo.allocatedReward,
      toBurn: data.toBurn || defaultInfo.toBurn,
      toReporter: data.toReporter || defaultInfo.toReporter,
      myReward: data.myReward || defaultInfo.myReward,
      willReceive: data.willReceive || defaultInfo.willReceive
    }
  }, [networkId, coverKey, account, productKey, incidentDate])

  useEffect(() => {
    let ignore = false

    setLoading(true)
    fetchInfo()
      .then((data) => {
        if (ignore || !data) {
          return
        }

        setInfo(data)
      })
      .catch(console.error)
      .finally(() => { return setLoading(false) })

    return () => {
      ignore = true
      setLoading(false)
    }
  }, [fetchInfo])

  const updateFetchInfo = useCallback(() => {
    fetchInfo()
      .then((_info) => {
        if (!_info) { return }
        setInfo(_info)
      })
      .catch(console.error)
  }, [fetchInfo])

  return {
    info,
    loading,
    refetch: updateFetchInfo
  }
}
