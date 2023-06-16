import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { registry } from '@neptunemutual/sdk'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'

export const useStakingPoolsAddress = () => {
  const [address, setAddress] = useState(null)
  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()

  useEffect(() => {
    let ignore = false
    if (!networkId || !account) { return }

    async function exec () {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const contractAddress = await registry.StakingPools.getAddress(
        networkId,
        signerOrProvider
      )

      if (ignore) { return }
      setAddress(contractAddress)
    }

    exec()

    return () => {
      ignore = true
    }
  }, [account, library, networkId])

  return address
}
