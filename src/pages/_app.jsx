import "tailwindcss/tailwind.css";
import "@fontsource/poppins/latin.css";
import "@fontsource/sora/latin.css";
import "../styles/globals.css";

import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { NetworkProvider } from "@/src/context/Network";
import { ToastProvider } from "@/lib/toast/provider";
import { AppConstantsProvider } from "@/src/context/AppConstants";
import { UnlimitedApprovalProvider } from "@/src/context/UnlimitedApproval";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { LanguageProvider } from "../i18n";
import { DEFAULT_VARIANT } from "@/src/config/toast";
import { CoversAndProductsProvider } from "@/src/context/CoversAndProductsData";
import { useEffect } from "react";
import { setupMetamaskForFirefox } from "@/utils/metamask-firefox";
import ErrorBoundary from "@/common/ErrorBoundary";
import { MainLayout } from "@/src/layouts/main/MainLayout";
import GoogleTagManager from "@/common/GoogleTagManager";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    setupMetamaskForFirefox();
  }, []);

  if (pageProps.noWrappers) {
    return (
      <ErrorBoundary>
        <LanguageProvider>
          <Component {...pageProps} />
        </LanguageProvider>
      </ErrorBoundary>
    );
  }

  return (
    <>
      <GoogleTagManager nonce={pageProps.nonce} />
      <ErrorBoundary>
        <LanguageProvider>
          <Web3ReactProvider getLibrary={getLibrary}>
            <NetworkProvider>
              <AppConstantsProvider>
                <CoversAndProductsProvider>
                  <UnlimitedApprovalProvider>
                    <ToastProvider variant={DEFAULT_VARIANT}>
                      <TxPosterProvider>
                        <MainLayout noHeader={pageProps.noHeader}>
                          <Component {...pageProps} />
                        </MainLayout>
                      </TxPosterProvider>
                    </ToastProvider>
                  </UnlimitedApprovalProvider>
                </CoversAndProductsProvider>
              </AppConstantsProvider>
            </NetworkProvider>
          </Web3ReactProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
