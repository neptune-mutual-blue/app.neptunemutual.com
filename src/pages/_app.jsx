import '@fontsource/inter/latin.css'
import '../common/GaugeChart/GaugeChart.css'
import '../common/GaugeChart/GaugeChartSemiCircle.css'
import '../styles/globals.css'

import { useEffect } from 'react'

import ErrorBoundary from '@/common/ErrorBoundary'
import {
  WalletDisclaimerPoup
} from '@/lib/connect-wallet/components/ConnectWallet/WalletDisclaimerPopup'
import { getLibrary } from '@/lib/connect-wallet/utils/web3'
import { ToastProvider } from '@/lib/toast/provider'
import { DEFAULT_VARIANT } from '@/src/config/toast'
import { AppConstantsProvider } from '@/src/context/AppConstants'
import { CookiesProvider } from '@/src/context/Cookie'
import {
  CoversAndProductsProvider2
} from '@/src/context/CoversAndProductsData2'
import { NetworkProvider } from '@/src/context/Network'
import { TxPosterProvider } from '@/src/context/TxPoster'
import { UnlimitedApprovalProvider } from '@/src/context/UnlimitedApproval'
import { MainLayout } from '@/src/layouts/main/MainLayout'
import { setupMetamaskForFirefox } from '@/utils/metamask-firefox'
import { Web3ReactProvider } from '@web3-react/core'

import { LanguageProvider } from '../i18n'
import { LiquidityGaugePoolsProvider } from '@/src/context/LiquidityGaugePools'

const Wrappers = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NetworkProvider>
        <AppConstantsProvider>
          <CoversAndProductsProvider2>
            <UnlimitedApprovalProvider>
              <ToastProvider variant={DEFAULT_VARIANT}>
                <TxPosterProvider>
                  <LiquidityGaugePoolsProvider>
                    <MainLayout>{children}</MainLayout>
                  </LiquidityGaugePoolsProvider>
                  <WalletDisclaimerPoup />
                </TxPosterProvider>
              </ToastProvider>
            </UnlimitedApprovalProvider>
          </CoversAndProductsProvider2>
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
      <CookiesProvider>
        <ErrorBoundary>
          <LanguageProvider>
            <Wrappers>
              <Component {...pageProps} />
            </Wrappers>
          </LanguageProvider>
        </ErrorBoundary>
      </CookiesProvider>
    </>
  )
}

export default MyApp
