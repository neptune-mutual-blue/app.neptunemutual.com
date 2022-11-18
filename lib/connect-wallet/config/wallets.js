// import BinanceWalletLogo from '../components/logos/BinanceWalletLogo'
import WalletConnectLogo from '@/lib/connect-wallet/components/logos/WalletConnectLogo'
import MetamaskLogo from '../components/logos/MetamaskLogo'
import { ConnectorNames } from './connectors'

export const wallets = [
  {
    id: '1',
    name: 'MetaMask',
    connectorName: ConnectorNames.Injected,
    Icon: MetamaskLogo
  },
  {
    id: '2',
    name: 'Wallet Connect',
    connectorName: ConnectorNames.WalletConnect,
    Icon: WalletConnectLogo
  }
  // {
  //   id: '2',
  //   name: 'Binance Chain Wallet',
  //   connectorName: ConnectorNames.BSC,
  //   Icon: BinanceWalletLogo
  // }
]
