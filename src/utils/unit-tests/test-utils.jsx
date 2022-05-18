import React from "react";
import { NetworkProvider } from "@/src/context/Network";
import { Web3ReactProvider } from "@web3-react/core";
import { UnlimitedApprovalProvider } from "@/src/context/UnlimitedApproval";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { AppConstantsProvider } from "@/src/context/AppConstants";
import { IpfsProvider } from "@/src/context/Ipfs";
import { CoversProvider } from "@/src/context/Covers";
import { ToastProvider } from "@/lib/toast/provider";
import { render } from "@testing-library/react";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { en, fr, ja, zh } from "make-plural/plurals";
import { messages as enMessages } from "@/locales/en/messages";
import { messages as frMessages } from "@/locales/fr/messages";
import { messages as jaMessages } from "@/locales/ja/messages";
import { messages as zhMessages } from "@/locales/zh/messages";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";
import { RouterContext } from "next/dist/shared/lib/router-context";

i18n.load({
  en: enMessages,
  fr: frMessages,
  ja: jaMessages,
  zh: zhMessages,
});
i18n.loadLocaleData({
  en: { plurals: en },
  fr: { plurals: fr },
  ja: { plurals: ja },
  zh: { plurals: zh },
});

const AllTheProviders = ({ children, router = createMockRouter({}) }) => {
  return (
    <RouterContext.Provider value={router}>
      <I18nProvider i18n={i18n}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <NetworkProvider>
            <AppConstantsProvider>
              <IpfsProvider>
                <CoversProvider>
                  <UnlimitedApprovalProvider>
                    <ToastProvider>
                      <TxPosterProvider>{children}</TxPosterProvider>
                    </ToastProvider>
                  </UnlimitedApprovalProvider>
                </CoversProvider>
              </IpfsProvider>
            </AppConstantsProvider>
          </NetworkProvider>
        </Web3ReactProvider>
      </I18nProvider>
    </RouterContext.Provider>
  );
};

export const withProviders = (Component, router = createMockRouter({})) => {
  return function Wrapper() {
    return (
      <AllTheProviders router={router}>
        <Component />
      </AllTheProviders>
    );
  };
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
