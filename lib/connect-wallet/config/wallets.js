import BinanceWalletLogo from '../components/logos/BinanceWalletLogo'
import OKXWalletLogo from '@/lib/connect-wallet/components/logos/OKXWalletLogo'
import WalletConnectLogo from '@/lib/connect-wallet/components/logos/WalletConnectLogo'
import MetamaskLogo from '../components/logos/MetamaskLogo'
import CoinbaseLogo from '../components/logos/CoinbaseLogo'
import { ConnectorNames } from './connectors'
import GnosisSafeLogo from '@/lib/connect-wallet/components/logos/GnosisSafeLogo'

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
  },
  {
    id: '4',
    name: 'Gnosis Wallet',
    connectorName: ConnectorNames.Gnosis,
    Icon: GnosisSafeLogo
  },
  {
    id: '5',
    name: 'Wallet Connect',
    connectorName: ConnectorNames.WalletConnect,
    Icon: WalletConnectLogo
  },
  {
    id: '5',
    name: 'Coinbase',
    connectorName: ConnectorNames.Coinbase,
    Icon: CoinbaseLogo
  }
]
