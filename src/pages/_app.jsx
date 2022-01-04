import { Web3ReactProvider } from "@web3-react/core";

import "../styles/globals.css";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { Header } from "@/components/UI/organisms/header";
import { AppWrapper } from "@/components/UI/organisms/AppWrapper";

function MyApp({ Component, pageProps }) {
  if (pageProps.noWrappers) {
    return <Component {...pageProps} />;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppWrapper>
        <Header></Header>
        <Component {...pageProps} />
      </AppWrapper>
    </Web3ReactProvider>
  );
}

export default MyApp;
