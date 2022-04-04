import { useEffect } from "react";

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

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { zh, en, fr, id, ja, ko, ru, es, tr } from "make-plural";

const position = {
  variant: "top_right",
};

i18n.loadLocaleData({
  zh: { plurals: zh },
  en: { plurals: en },
  fr: { plurals: fr },
  id: { plurals: id },
  ja: { plurals: ja },
  ko: { plurals: ko },
  ru: { plurals: ru },
  es: { plurals: es },
  tr: { plurals: tr },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  const locale = router.locale;

  useEffect(() => {
    async function load(l) {
      const { messages } = await import(`../../locales/${l}/messages.po`);

      i18n.load(l, messages);
      i18n.activate(l);
    }

    load(locale);
  }, [locale]);

  if (pageProps.noWrappers) {
    return <Component {...pageProps} />;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <NetworkProvider>
        <AppConstantsProvider>
          <IpfsProvider>
            <CoversProvider>
              <UnlimitedApprovalProvider>
                <ToastProvider variant={position.variant}>
                  <TxPosterProvider>
                    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
                      <Header></Header>
                      <div className="relative sm:static">
                        <Component {...pageProps} />
                        <DisclaimerModal />
                        <ScrollToTopButton />
                      </div>
                    </I18nProvider>
                  </TxPosterProvider>
                </ToastProvider>
              </UnlimitedApprovalProvider>
            </CoversProvider>
          </IpfsProvider>
        </AppConstantsProvider>
      </NetworkProvider>
    </Web3ReactProvider>
  );
}

export default MyApp;
