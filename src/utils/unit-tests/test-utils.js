import React from "react";

import { NetworkProvider } from "@/src/context/Network";
import { Web3ReactProvider } from "@web3-react/core";
import { UnlimitedApprovalProvider } from "@/src/context/UnlimitedApproval";
import { TxPosterProvider } from "@/src/context/TxPoster";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { render } from "@testing-library/react";

import { getLibrary } from "@/lib/connect-wallet/utils/web3";

const AllTheProviders = ({ children }) => {
  return (
    <I18nProvider i18n={i18n}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <NetworkProvider>
          <UnlimitedApprovalProvider>
              <TxPosterProvider>
                {children}
              </TxPosterProvider>
          </UnlimitedApprovalProvider>
        </NetworkProvider>
      </Web3ReactProvider>
    </I18nProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
