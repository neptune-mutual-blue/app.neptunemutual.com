import '@fontsource/poppins/latin.css'
import '@fontsource/sora/latin.css'
import '../styles/globals.css'

import { Web3ReactProvider } from '@web3-react/core'
import { getLibrary } from '@/lib/connect-wallet/utils/web3'
import { NetworkProvider } from '@/src/context/Network'
import { ToastProvider } from '@/lib/toast/provider'
import { AppConstantsProvider } from '@/src/context/AppConstants'
import { UnlimitedApprovalProvider } from '@/src/context/UnlimitedApproval'
import { TxPosterProvider } from '@/src/context/TxPoster'
import { LanguageProvider } from '../i18n'
import { DEFAULT_VARIANT } from '@/src/config/toast'
import { CoversAndProductsProvider } from '@/src/context/CoversAndProductsData'
import { useEffect } from 'react'
import { setupMetamaskForFirefox } from '@/utils/metamask-firefox'
import ErrorBoundary from '@/common/ErrorBoundary'
import { MainLayout } from '@/src/layouts/main/MainLayout'
import Script from 'next/script'
import { getNetworkId, mainnetChainIds } from '@/src/config/environment'

const Wrappers = ({ children, noHeader }) => {
  const networkId = getNetworkId()
  const isMainnet = mainnetChainIds.indexOf(networkId) > -1
  const clarityTrackingCode = isMainnet
    ? process.env.NEXT_PUBLIC_CLARITY_TRACKING_CODE_MAINNET
    : process.env.NEXT_PUBLIC_CLARITY_TRACKING_CODE_TESTNET

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NetworkProvider>
        <AppConstantsProvider>
          <CoversAndProductsProvider>
            <UnlimitedApprovalProvider>
              <ToastProvider variant={DEFAULT_VARIANT}>
                <TxPosterProvider>
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
                  <MainLayout noHeader={noHeader}>{children}</MainLayout>
                </TxPosterProvider>
              </ToastProvider>
            </UnlimitedApprovalProvider>
          </CoversAndProductsProvider>
        </AppConstantsProvider>
      </NetworkProvider>
    </Web3ReactProvider>
  )
}

function MyApp ({ Component, pageProps }) {
  useEffect(() => {
    setupMetamaskForFirefox()
  }, [])

  if (pageProps.noWrappers) {
    return <Component {...pageProps} />
  }

  return (
    <>
      <ErrorBoundary>
        <LanguageProvider>
          <Wrappers noHeader={pageProps.noHeader}>
            <Component {...pageProps} />
          </Wrappers>
        </LanguageProvider>
      </ErrorBoundary>
    </>
  )
}

export default MyApp
