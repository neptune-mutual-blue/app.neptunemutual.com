import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'

export const useBlockHeight = () => {
  const [blockHeight, setblockHeight] = useState(1)

  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()

  useEffect(() => {
    let ignore = false
    if (!networkId || !account) { return }

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    if (!signerOrProvider) { return }

    signerOrProvider.provider
      .getBlockNumber()
      .then((blockNumber) => {
        if (ignore) { return }
        setblockHeight(blockNumber)
      })
      .catch(console.error)

    return () => {
      ignore = true
    }
  }, [account, library, networkId])

  return blockHeight
}
