import React from "react";

import { AppWrapper } from "@/components/UI/organisms/AppWrapper";
import { ToastProvider } from "@/lib/toast/provider";
import { Web3ReactProvider } from "@web3-react/core";
import { render } from "@testing-library/react";

import { getLibrary } from "@/lib/connect-wallet/utils/web3";

const position = {
  variant: "top_right",
};

const AllTheProviders = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppWrapper>
        <ToastProvider variant={position.variant}>{children}</ToastProvider>
      </AppWrapper>
    </Web3ReactProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";

export { customRender as render };
