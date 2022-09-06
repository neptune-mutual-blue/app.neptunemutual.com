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

const Wrappers = ({ disabled, children, noHeader }) => {
  if (disabled) {
    return children;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NetworkProvider>
        <AppConstantsProvider>
          <CoversAndProductsProvider>
            <UnlimitedApprovalProvider>
              <ToastProvider variant={DEFAULT_VARIANT}>
                <TxPosterProvider>
                  <MainLayout noHeader={noHeader}>{children}</MainLayout>
                </TxPosterProvider>
              </ToastProvider>
            </UnlimitedApprovalProvider>
          </CoversAndProductsProvider>
        </AppConstantsProvider>
      </NetworkProvider>
    </Web3ReactProvider>
  );
};

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    setupMetamaskForFirefox();
  }, []);

  return (
    <>
      <ErrorBoundary>
        <LanguageProvider>
          <Wrappers
            disabled={pageProps.noWrappers}
            noHeader={pageProps.noHeader}
          >
            <Component {...pageProps} />
          </Wrappers>
        </LanguageProvider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
