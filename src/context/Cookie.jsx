import { getNetworkId, mainnetChainIds } from '@/src/config/environment'
import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { LocalStorage } from '@/utils/localstorage'
import Script from 'next/script'
import React from 'react'

const CookieContext = React.createContext({
  accepted: false,
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
  const [accepted, setAccepted] = useLocalStorage(LocalStorage.KEYS.COOKIE_POLICY, false)

  let clarityTrackingCode = null
  if (typeof window !== 'undefined') {
    const networkId = getNetworkId()
    const isMainnet = mainnetChainIds.indexOf(networkId) > -1
    clarityTrackingCode = isMainnet
      ? process.env.NEXT_PUBLIC_CLARITY_TRACKING_CODE_MAINNET
      : process.env.NEXT_PUBLIC_CLARITY_TRACKING_CODE_TESTNET
  }

  return (
    <CookieContext.Provider value={{ accepted, setAccepted }}>
      {children}
      {accepted && clarityTrackingCode && (
        <Script
          id='ms-clarity'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${clarityTrackingCode}");
          `
          }}
        />
      )}
    </CookieContext.Provider>
  )
}
