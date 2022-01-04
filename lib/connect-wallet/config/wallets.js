import BinanceWalletLogo from "../components/logos/binance-wallet";
import MetamaskLogo from "../components/logos/metamask";
import WalletConnectLogo from "../components/logos/walletconnect";
import { ConnectorNames } from "./connectors";

export const wallets = [
  {
    id: "1",
    name: "MetaMask",
    connectorName: ConnectorNames.Injected,
    Icon: MetamaskLogo,
  },
  {
    id: "2",
    name: "Binance Chain Wallet",
    connectorName: ConnectorNames.BSC,
    Icon: BinanceWalletLogo,
  },
  {
    id: "3",
    name: "Wallet Connect",
    connectorName: ConnectorNames.WalletConnect,
    Icon: WalletConnectLogo,
  },
];
