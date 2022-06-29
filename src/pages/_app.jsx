import "tailwindcss/tailwind.css";
import "@fontsource/poppins/latin.css";
import "@fontsource/sora/latin.css";
import "../styles/globals.css";

import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { Header } from "@/common/Header/Header";
import { NetworkProvider } from "@/src/context/Network";
import { ToastProvider } from "@/lib/toast/provider";
import { AppConstantsProvider } from "@/src/context/AppConstants";
import { UnlimitedApprovalProvider } from "@/src/context/UnlimitedApproval";
import { DisclaimerModal } from "@/common/Disclaimer/DisclaimerModal";
import { ScrollToTopButton } from "@/common/ScrollToTop/ScrollToTopButton";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { LanguageProvider } from "../i18n";
import { DEFAULT_VARIANT } from "@/src/config/toast";
import { CoversAndProductsProvider } from "@/src/context/CoversAndProductsData";

function MyApp({ Component, pageProps }) {
  if (pageProps.noWrappers) {
    return (
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>
          <AppConstantsProvider>
            <CoversAndProductsProvider>
              <UnlimitedApprovalProvider>
                <ToastProvider variant={DEFAULT_VARIANT}>
                  <TxPosterProvider>
                    <Header></Header>
                    <div className="relative sm:static">
                      <Component {...pageProps} />
                      <DisclaimerModal />
                      <ScrollToTopButton />
                    </div>
                  </TxPosterProvider>
                </ToastProvider>
              </UnlimitedApprovalProvider>
            </CoversAndProductsProvider>
          </AppConstantsProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    </LanguageProvider>
  );
}

export default MyApp;
