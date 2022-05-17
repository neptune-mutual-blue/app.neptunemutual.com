import React from "react";

import { NetworkProvider } from "@/src/context/Network";
import { Web3ReactProvider } from "@web3-react/core";
import { UnlimitedApprovalProvider } from "@/src/context/UnlimitedApproval";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { AppConstantsProvider } from "@/src/context/AppConstants";
import { IpfsProvider } from "@/src/context/Ipfs";
import { CoversProvider } from "@/src/context/Covers";
import { ToastProvider } from "@/lib/toast/provider";
import { render } from "@testing-library/react";

import { RouterContext } from "next/dist/shared/lib/router-context";

import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { LanguageProvider } from "@/src/i18n";
import { createRouter } from "next/router";

const router = createRouter("", {}, "", {
  subscription: jest.fn().mockImplementation(Promise.resolve),
  initialProps: {},
  pageLoader: jest.fn(),
  Component: jest.fn(),
  App: jest.fn(),
  wrapApp: jest.fn(),
  isFallback: false,
});

const AllTheProviders = ({ children }) => {
  return (
    <RouterContext.Provider value={router}>
      <LanguageProvider forceRenderOnLocaleChange={false}>
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
      </LanguageProvider>
    </RouterContext.Provider>
  );
};

const customRender = async (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
