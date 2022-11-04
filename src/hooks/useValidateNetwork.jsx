import { useEffect, useState } from 'react'
import { mainnetChainIds } from '@/src/config/environment'

/**
 *
 * @param {number} networkId
 * @returns
 */
export const useValidateNetwork = (networkId) => {
  const [isMainNet, setIsMainNet] = useState(false)

  useEffect(() => {
    if (networkId) {
      setIsMainNet(mainnetChainIds.indexOf(networkId) > -1)
    }
  }, [networkId])

  return { isMainNet, isTestNet: !isMainNet }
}
