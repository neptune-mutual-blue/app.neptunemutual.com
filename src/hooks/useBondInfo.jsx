import { useCallback, useEffect, useState } from 'react'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { ADDRESS_ONE, BOND_INFO_URL } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'

const defaultInfo = {
  lpTokenAddress: '',
  discountRate: '0',
  vestingTerm: '0',
  maxBond: '0',
  totalNpmAllocated: '0',
  totalNpmDistributed: '0',
  bondContribution: '0',
  claimable: '0',
  unlockDate: '0'
}

const fetchBondInfoApi = async (networkId, account) => {
  if (!networkId) {
    return
  }

  const response = await fetch(
    getReplacedString(BOND_INFO_URL, { networkId, account }),
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

  const { data } = await response.json()

  return {
    lpTokenAddress: data.lpToken,
    discountRate: data.discountRate,
    vestingTerm: data.vestingTerm,
    maxBond: data.maxBond,
    totalNpmAllocated: data.totalNpmAllocated,
    totalNpmDistributed: data.totalNpmDistributed,
    bondContribution: data.bondContribution,
    claimable: data.claimable,
    unlockDate: data.unlockDate
  }
}

export const useBondInfo = () => {
  const [info, setInfo] = useState(defaultInfo)

  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const { contractRead } = useTxPoster()
  const { notifyError } = useErrorNotifier()

  const fetchBondInfo = useCallback(
    async (onResult) => {
      if (!networkId) {
        return
      }

      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.BondPool.getInstance(
        networkId,
        signerOrProvider
      )

      const result = await contractRead({
        instance,
        methodName: 'getInfo',
        args: [account],
        onError: notifyError
      })

      const [addresses, values] = result

      const [lpToken] = addresses
      const [
        _marketPrice,
        discountRate,
        vestingTerm,
        maxBond,
        totalNpmAllocated,
        totalNpmDistributed,
        _npmAvailable,
        bondContribution,
        claimable,
        unlockDate
      ] = values

      onResult({
        lpTokenAddress: lpToken,
        discountRate: discountRate.toString(),
        vestingTerm: vestingTerm.toString(),
        maxBond: maxBond.toString(),
        totalNpmAllocated: totalNpmAllocated.toString(),
        totalNpmDistributed: totalNpmDistributed.toString(),
        bondContribution: bondContribution.toString(),
        claimable: claimable.toString(),
        unlockDate: unlockDate.toString()
      })
    },
    [account, contractRead, library, networkId, notifyError]
  )

  useEffect(() => {
    let ignore = false

    if (!account) {
      // If wallet is not connected, get data from API
      fetchBondInfoApi(networkId, ADDRESS_ONE)
        .then((data) => {
          if (ignore || !data) return
          setInfo(data)
        })
        .catch(console.error)
      return
    }

    // If wallet is connected, get data from provider
    const onResult = (_info) => {
      if (ignore || !_info) return
      setInfo(_info)
    }

    fetchBondInfo(onResult).catch(console.error)

    return () => {
      ignore = true
    }
  }, [account, fetchBondInfo, networkId])

  const updateBondInfo = useCallback(() => {
    const onResult = (_info) => {
      setInfo(_info || defaultInfo)
    }

    fetchBondInfo(onResult).catch(console.error)
  }, [fetchBondInfo])

  return { info, refetch: updateBondInfo }
}
