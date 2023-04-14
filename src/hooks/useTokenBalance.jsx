import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useWeb3React } from '@web3-react/core'
import { useEffect, useState } from 'react'

import { Contract } from '@ethersproject/contracts'
import { config } from '@neptunemutual/sdk'
import { convertFromUnits } from '@/utils/bn'

const useTokenBalance = ({ tokenAddress, decimal }) => {
  const [balance, setBalance] = useState('0')

  const { account, library } = useWeb3React()
  const { networkId } = useNetwork()

  useEffect(() => {
    if (!account || !tokenAddress) return

    const provider = getProviderOrSigner(library, account, networkId)
    const instance = new Contract(tokenAddress, config.abis.IERC20Detailed, provider)

    if (!instance) {
      console.log('No instance found')
    }

    (async function () {
      const result = await instance.balanceOf(account)
      const _balance = result.toString()
      const convertedBalance = convertFromUnits(_balance, decimal).toString()
      setBalance(convertedBalance)
    })()
  }, [account, tokenAddress, library, networkId, decimal])

  return balance
}

export { useTokenBalance }
