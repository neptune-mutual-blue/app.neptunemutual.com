import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { t } from '@lingui/macro'

import { useNetwork } from '@/src/context/Network'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { ADDRESS_ONE, BOND_INFO_URL } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'
import { getInfo } from '@/src/services/protocol/bond/info'

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

export const useBondInfo = () => {
  const [info, setInfo] = useState(defaultInfo)

  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()
  const { notifyError } = useErrorNotifier()

  const fetchBondInfo = useCallback(
    async (onResult) => {
      if (!networkId) {
        return
      }

      const handleError = (err) => {
        notifyError(err, t`Could not get bond info`)
      }

      try {
        let data

        if (account) {
          // Get data from provider if wallet's connected
          const signerOrProvider = getProviderOrSigner(
            library,
            account,
            networkId
          )
          data = await getInfo(
            networkId,
            account,
            signerOrProvider.provider
          )
        } else {
          // Get data from API if wallet's not connected
          const response = await fetch(
            getReplacedString(BOND_INFO_URL, {
              networkId,
              account: account || ADDRESS_ONE
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

          data = (await response.json()).data
        }

        if (!data || Object.keys(data).length === 0) {
          return
        }

        onResult({
          lpTokenAddress: data.lpToken,
          discountRate: data.discountRate,
          vestingTerm: data.vestingTerm,
          maxBond: data.maxBond,
          totalNpmAllocated: data.totalNpmAllocated,
          totalNpmDistributed: data.totalNpmDistributed,
          bondContribution: data.bondContribution,
          claimable: data.claimable,
          unlockDate: data.unlockDate
        })
      } catch (err) {
        handleError(err)
      }
    },
    [account, library, networkId, notifyError]
  )

  useEffect(() => {
    let ignore = false

    fetchBondInfo((_info) => {
      if (ignore || !_info) return
      setInfo(_info)
    }).catch(console.error)

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
