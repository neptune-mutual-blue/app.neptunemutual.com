import { Web3ReactProvider } from "@web3-react/core";
import "tailwindcss/tailwind.css";

import "@fontsource/poppins/latin.css";
import "@fontsource/sora/latin.css";
import "../styles/globals.css";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { Header } from "@/components/UI/organisms/header";
import { AppWrapper } from "@/components/UI/organisms/AppWrapper";
import { ToastProvider } from "@/lib/toast/provider";

function MyApp({ Component, pageProps }) {
  if (pageProps.noWrappers) {
    return <Component {...pageProps} />;
  }

  const position = {
    variant: "top_right",
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppWrapper>
        <ToastProvider variant={position.variant}>
          <Header></Header>
          <Component {...pageProps} />
        </ToastProvider>
      </AppWrapper>
    </Web3ReactProvider>
  );
}

export default MyApp;
