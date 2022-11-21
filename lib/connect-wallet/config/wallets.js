import BinanceWalletLogo from '../components/logos/BinanceWalletLogo'
import OKXWalletLogo from '@/lib/connect-wallet/components/logos/OKXWalletLogo'
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
    name: 'Binance Chain Wallet',
    connectorName: ConnectorNames.BSC,
    Icon: BinanceWalletLogo
  },
  {
    id: '3',
    name: 'OKX Wallet',
    connectorName: ConnectorNames.OKXWallet,
    Icon: OKXWalletLogo
  }
]
