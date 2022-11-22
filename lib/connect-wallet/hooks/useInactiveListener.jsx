import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { ConnectorNames } from '../config/connectors'
import { ACTIVE_CONNECTOR_KEY } from '../config/localstorage'
import useAuth from './useAuth'
import { getCorrectEthereumProvider } from '@/lib/connect-wallet/utils/wallet'

export function useInactiveListener (networkId, notifier) {
  const { login, logout } = useAuth(networkId, notifier)
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window

    const connectorName = window.localStorage.getItem(ACTIVE_CONNECTOR_KEY)

    if (connectorName !== ConnectorNames.Injected && connectorName !== ConnectorNames.Coinbase) {
      return
    }

    const provider = getCorrectEthereumProvider(ethereum)

    if (provider && provider.on && !active && !error) {
      const handleChainChanged = async (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        await logout()
        login(ConnectorNames.Injected)
      }
      const handleAccountsChanged = async (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          await logout()
          login(ConnectorNames.Injected)
        }
      }

      provider.on('chainChanged', handleChainChanged)
      provider.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (provider.removeListener) {
          provider.removeListener('chainChanged', handleChainChanged)
          provider.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [active, error, activate, login, logout, networkId])

  useEffect(() => {
    const { ethereum } = window

    const provider = getCorrectEthereumProvider(ethereum)

    if (provider && provider.on) {
      const handleChainChanged = async (chainId) => {
        const chainIdOnChange = await parseInt(chainId)
        if (networkId !== chainIdOnChange) {
          logout()
        }
      }
      provider.on('chainChanged', handleChainChanged)

      return () => {
        if (provider.removeListener) {
          provider.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [logout, networkId])

  useEffect(() => {
    const { BinanceChain } = window

    const connectorName = window.localStorage.getItem(ACTIVE_CONNECTOR_KEY)

    if (connectorName !== ConnectorNames.BSC) {
      return
    }

    if (BinanceChain && BinanceChain.on && !active && !error) {
      const handleChainChanged = async (chainId) => {
        console.log("Handling 'chainChanged' event with payload", chainId)
        await logout()
        login(ConnectorNames.BSC)
      }
      const handleAccountsChanged = async (accounts) => {
        console.log("Handling 'accountsChanged' event with payload", accounts)
        if (accounts.length > 0) {
          await logout()
          login(ConnectorNames.BSC)
        }
      }

      BinanceChain.on('chainChanged', handleChainChanged)
      BinanceChain.on('accountsChanged', handleAccountsChanged)

      return () => {
        if (BinanceChain.removeListener) {
          BinanceChain.removeListener('chainChanged', handleChainChanged)
          BinanceChain.removeListener('accountsChanged', handleAccountsChanged)
        }
      }
    }
  }, [active, error, activate, login, logout])
}
