import { mainnetChainIds } from '@/src/config/environment'
import { useNetwork } from '@/src/context/Network'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { addClarityAnalytics, addGoogleAnalytics } from '@/utils/analytics'
import { LocalStorage } from '@/utils/localstorage'
import React, { useEffect } from 'react'

const CookieContext = React.createContext({
  accepted: undefined,
  setAccepted: (_value) => {}
})

export function useCookies () {
  const context = React.useContext(CookieContext)
  if (context === undefined) {
    throw new Error('useCookies must be used within a CookiesProvider')
  }

  return context
}

export const CookiesProvider = ({ children }) => {
  const [accepted, setAccepted] = useLocalStorage(LocalStorage.KEYS.COOKIE_POLICY)
  const { networkId } = useNetwork()

  useEffect(() => {
    let clarityTrackingCode = null
    let googleAnalyticsId = null

    if (typeof window !== 'undefined') {
      const isMainnet = mainnetChainIds.indexOf(networkId) > -1

      clarityTrackingCode = isMainnet
        ? process.env.NEXT_PUBLIC_CLARITY_TRACKING_CODE_MAINNET
        : process.env.NEXT_PUBLIC_CLARITY_TRACKING_CODE_TESTNET

      googleAnalyticsId = isMainnet
        ? process.env.NEXT_PUBLIC_GA_CODE_MAINNET
        : process.env.NEXT_PUBLIC_GA_CODE_TESTNET
    }

    if (accepted) {
      addClarityAnalytics(clarityTrackingCode)
      addGoogleAnalytics(googleAnalyticsId)
    }
  }, [accepted, networkId])

  return (
    <CookieContext.Provider value={{ accepted, setAccepted }}>
      {children}
    </CookieContext.Provider>
  )
}
