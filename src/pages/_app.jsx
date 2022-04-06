import "tailwindcss/tailwind.css";
import "@fontsource/poppins/latin.css";
import "@fontsource/sora/latin.css";
import "../styles/globals.css";

import { Web3ReactProvider } from "@web3-react/core";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { Header } from "@/components/UI/organisms/header";
import { NetworkProvider } from "@/src/context/Network";
import { ToastProvider } from "@/lib/toast/provider";
import { AppConstantsProvider } from "@/src/context/AppConstants";
import { CoversProvider } from "@/src/context/Covers";
import { UnlimitedApprovalProvider } from "@/src/context/UnlimitedApproval";
import { DisclaimerModal } from "@/components/UI/organisms/disclaimer/DisclaimerModal";
import { ScrollToTopButton } from "@/components/UI/atoms/scrollToTop";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { IpfsProvider } from "@/src/context/Ipfs";
import { useRouter } from "next/router";
import { LanguageProvider } from "../i18n";
import { DEFAULT_VARIANT } from "@/src/config/toast";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const locale = router.locale;

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
            <IpfsProvider>
              <CoversProvider>
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
              </CoversProvider>
            </IpfsProvider>
          </AppConstantsProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    </LanguageProvider>
  );
}

export default MyApp;
