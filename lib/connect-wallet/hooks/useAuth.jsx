import {
  useCallback,
  useEffect
} from 'react'

import {
  UnsupportedChainIdError,
  useWeb3React
} from '@web3-react/core'

import { NetworkNames } from '../config/chains'
import { ConnectorNames } from '../config/connectors'
import { ACTIVE_CONNECTOR_KEY } from '../config/localstorage'
import { wallets } from '../config/wallets'
import { getConnectorByName } from '../utils/connectors'
import * as notifications from '../utils/notifications'
import { setupNetwork } from '../utils/wallet'

const handleInjectedError = async (notify, error) => {
  const { NoEthereumProviderError, UserRejectedRequestErrorInjected } =
    await import('../injected/errors')

  if (error instanceof NoEthereumProviderError) {
    return notifications.providerError(notify, error)
  }

  if (error instanceof UserRejectedRequestErrorInjected) {
    return notifications.authError(notify, error)
  }

  notifications.unidentifiedError(notify, error)
}

const handleBSCError = async (notify, error) => {
  const { NoBscProviderError } = await import('../binance-wallet/errors')

  if (error instanceof NoBscProviderError) {
    return notifications.providerError(notify, error)
  }

  notifications.unidentifiedError(notify, error)
}

const clearConnectionData = () => {
  window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY)
}

const activateConnector = async (
  connectorName,
  activate,
  networkId,
  notify
) => {
  const connector = await getConnectorByName(connectorName, networkId)

  if (!connector) {
    console.info('Invalid Connector Name', connectorName)

    return
  }

  window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, connectorName)

  setTimeout(
    // added a slight delay in executing activate fx in connecting the wallet to prevent stale error issue
    () => {
      activate(connector, async (error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork(connectorName, networkId)

          if (hasSetup) {
            return activate(connector, clearConnectionData)
          }

          clearConnectionData()

          const wallet = wallets.find(
            (_wallet) => { return _wallet.connectorName === connectorName }
          )

          return notifications.wrongNetwork(
            notify,
            NetworkNames[networkId],
            wallet.name,
            error
          )
        }

        clearConnectionData()

        switch (connectorName) {
          case ConnectorNames.Injected:
            return handleInjectedError(notify, error)

          case ConnectorNames.BSC:
            return handleBSCError(notify, error)
        }

        notifications.unidentifiedError(notify, error)
      })
    },
    100
  )
}

const useAuth = (networkId, notify = console.log) => {
  const { activate, deactivate, connector } = useWeb3React()

  useEffect(() => {
    if (!connector) {
      return
    }

    connector?.addListener('Web3ReactDeactivate', clearConnectionData)

    return () => {
      connector?.removeListener('Web3ReactDeactivate', clearConnectionData)
    }
  }, [connector])

  const login = useCallback(
    (connectorName) => {
      return activateConnector(connectorName, activate, networkId, notify)
    },
    [activate, networkId, notify]
  )

  const logout = useCallback(() => {
    clearConnectionData()

    deactivate()
  }, [deactivate])

  return { logout, login }
}

export { useAuth }
