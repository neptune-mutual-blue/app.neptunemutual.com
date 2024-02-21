import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { abis } from '@/src/config/contracts/abis'
import { ChainConfig } from '@/src/config/hardcoded'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { utils } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

const initialData = {
  veNPMBalance: '0',
  lockedNPMBalance: '0',
  unlockTimestamp: '0'
}

export const useVoteEscrowData = () => {
  const { library, account } = useWeb3React()

  const { networkId } = useNetwork()

  const [loading, setLoading] = useState(false)
  const [escrowData, setEscrowData] = useState(initialData)

  const { contractRead } = useTxPoster()

  const getData = useCallback(async () => {
    if (!account) {
      return
    }

    setLoading(true)

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)
      const instance = utils.contract.getContract(ChainConfig[networkId || 1].veNPM.address, abis.IVoteEscrowToken, signerOrProvider)

      const unlockTimestamp = await contractRead({
        instance,
        methodName: '_unlockAt',
        args: [account]
      })

      const calls = [
        instance.balanceOf(account),
        instance._balances(account)
      ]

      const [veNPMBalance, lockedNPMBalance] = await Promise.all(calls)

      setEscrowData({
        veNPMBalance: veNPMBalance.toString(),
        lockedNPMBalance: lockedNPMBalance.toString(),
        unlockTimestamp: unlockTimestamp.toString()
      })
    } catch (err) {
      setEscrowData(initialData)
      console.error(err)
    }

    setLoading(false)
  }, [account, contractRead, library, networkId])

  useEffect(() => {
    // Get data on load
    getData()
  }, [getData])

  return {
    refetch: getData,
    loading,
    data: {
      veNPMBalance: escrowData.veNPMBalance,
      lockedNPMBalance: escrowData.lockedNPMBalance,
      unlockTimestamp: escrowData.unlockTimestamp
    }
  }
}
