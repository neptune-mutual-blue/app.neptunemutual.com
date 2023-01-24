import GnosisSafeLogo
  from '@/lib/connect-wallet/components/logos/GnosisSafeLogo'
import OKXWalletLogo from '@/lib/connect-wallet/components/logos/OKXWalletLogo'

import BinanceWalletLogo from '../components/logos/BinanceWalletLogo'
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
  },
  {
    id: '4',
    name: 'Gnosis Wallet',
    connectorName: ConnectorNames.Gnosis,
    Icon: GnosisSafeLogo
  }
]
