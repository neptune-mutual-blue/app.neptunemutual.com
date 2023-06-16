import BitKeepLogo from '@/lib/connect-wallet/components/logos/BitKeepLogo'
import CoinbaseLogo from '@/lib/connect-wallet/components/logos/CoinbaseLogo'
import GnosisSafeLogo
  from '@/lib/connect-wallet/components/logos/GnosisSafeLogo'
import InjectedWalletLogo
  from '@/lib/connect-wallet/components/logos/InjectedWalletLogo'
import OKXWalletLogo from '@/lib/connect-wallet/components/logos/OKXWalletLogo'
import {
  getBinanceWalletProvider,
  getBitKeepWalletProvider,
  getCoinbaseWalletProvider,
  getInjectedProvider,
  getMetaMaskProvider,
  getOkxWalletProvider
} from '@/lib/connect-wallet/providers'
import { isNotFrame } from '@/lib/connect-wallet/utils/wallet'

import BinanceWalletLogo from '../components/logos/BinanceWalletLogo'
import MetamaskLogo from '../components/logos/MetamaskLogo'
import { ConnectorNames } from './connectors'

export const wallets = [
  {
    id: '1',
    name: 'Injected Web3 Wallet', // Also can say (Browser Wallet)
    connectorName: ConnectorNames.Injected,
    Icon: InjectedWalletLogo,
    isAvailable: () => { return !!getInjectedProvider() }
  },
  {
    id: '2',
    name: 'MetaMask',
    connectorName: ConnectorNames.MetaMask,
    Icon: MetamaskLogo,
    isAvailable: () => { return !!getMetaMaskProvider() }
  },
  {
    id: '3',
    name: 'Coinbase Wallet',
    connectorName: ConnectorNames.CoinbaseWallet,
    Icon: CoinbaseLogo,
    isAvailable: () => { return !!getCoinbaseWalletProvider() }
  },
  {
    id: '4',
    name: 'BitKeep Wallet',
    connectorName: ConnectorNames.BitKeepWallet,
    Icon: BitKeepLogo,
    isAvailable: () => { return !!getBitKeepWalletProvider() }
  },
  {
    id: '5',
    name: 'Binance Chain Wallet',
    connectorName: ConnectorNames.BSC,
    Icon: BinanceWalletLogo,
    isAvailable: () => { return !!getBinanceWalletProvider() }
  },
  {
    id: '6',
    name: 'OKX Wallet',
    connectorName: ConnectorNames.OKXWallet,
    Icon: OKXWalletLogo,
    isAvailable: () => { return !!getOkxWalletProvider() }
  },
  {
    id: '7',
    name: 'Gnosis Wallet',
    connectorName: ConnectorNames.Gnosis,
    Icon: GnosisSafeLogo,
    isAvailable: () => { return !isNotFrame() }
  }
]
