import React, { useEffect } from 'react'

import { ChainColorsRGB } from '@/lib/connect-wallet/config/chains'
import { useEagerConnect } from '@/lib/connect-wallet/hooks/useEagerConnect'
import {
  useInactiveListener
} from '@/lib/connect-wallet/hooks/useInactiveListener'
import { getNetworkId } from '@/src/config/environment'

const NetworkContext = React.createContext({ networkId: null })

export function useNetwork () {
  const context = React.useContext(NetworkContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppWrapper')
  }

  return context
}

export const NetworkProvider = ({ children }) => {
  const networkId = getNetworkId()

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--color-primary',
      ChainColorsRGB[networkId] || ChainColorsRGB.DEFAULT
    )
  }, [networkId])

  return (
    <NetworkContext.Provider value={{ networkId }}>
      {networkId && <PostNetworkIdLoad networkId={networkId} />}
      {children}
    </NetworkContext.Provider>
  )
}

// This component makes sure that given hooks are only executed once after networkId is loaded
const PostNetworkIdLoad = ({ networkId }) => {
  useEagerConnect(networkId)
  useInactiveListener(networkId)

  return null
}
