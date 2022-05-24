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
import { RouterContext } from "next/dist/shared/lib/router-context";
import { SortableStatsProvider } from "@/src/context/SortableStatsContext";
import { ACTIVE_CONNECTOR_KEY } from "@/lib/connect-wallet/config/localstorage";
import { createMockRouter } from "@/utils/unit-tests/createMockRouter";

export * from "@testing-library/react";

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

export const withSorting = (Component) => {
  return function Wrapper() {
    return (
      <SortableStatsProvider>
        <Component />
      </SortableStatsProvider>
    );
  };
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

export { customRender as render };

const LocalStorage = (() => {
  let store = {
    [ACTIVE_CONNECTOR_KEY]: process.env.NEXT_PUBLIC_TEST_CONNECTOR,
  };
  return {
    getItem: (key, defaultValue = "") => {
      return store[key] || defaultValue;
    },
    setItem: (key, value) => {
      store[key] = value;
    },
    clearn: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: LocalStorage });

global.crypto = {
  getRandomValues: jest.fn().mockReturnValueOnce(new Uint32Array(10)),
};

const ETHEREUM_METHODS = {
  eth_requestAccounts: () => [process.env.NEXT_PUBLIC_TEST_ACCOUNT],
};

global.ethereum = {
  enable: jest.fn(() => Promise.resolve(true)),
  send: jest.fn((method) => {
    if (method === "eth_chainId") {
      return Promise.resolve(1);
    }

    if (method === "eth_requestAccounts") {
      return Promise.resolve(process.env.NEXT_PUBLIC_TEST_ACCOUNT);
    }

    return Promise.resolve(true);
  }),
  request: jest.fn(async ({ method }) => {
    if (ETHEREUM_METHODS.hasOwnProperty(method)) {
      return ETHEREUM_METHODS[method];
    }

    return "";
  }),
  on: jest.fn(() => {}),
};
