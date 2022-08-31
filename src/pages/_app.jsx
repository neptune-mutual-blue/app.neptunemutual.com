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
import Script from "next/script";
import { GTM_ID } from "@/src/config/constants";

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
      <Script
        id="gtag-base"
        strategy="afterInteractive"
        nonce="random"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
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
