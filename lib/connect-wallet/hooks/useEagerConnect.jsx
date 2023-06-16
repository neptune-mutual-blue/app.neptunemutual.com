import { useEffect } from 'react'
import { ConnectorNames } from '../config/connectors'
import { ACTIVE_CONNECTOR_KEY } from '../config/localstorage'
import { useAuth } from './useAuth'

const _binanceChainListener = async () => {
  return new Promise((resolve) => {
    return Object.defineProperty(window, 'BinanceChain', {
      get () {
        return this.bsc
      },
      set (bsc) {
        this.bsc = bsc

        resolve()
      }
    })
  }
  )
}

export const useEagerConnect = (networkId, notifier) => {
  const { login } = useAuth(networkId, notifier)

  useEffect(() => {
    const connectorName = window.localStorage.getItem(ACTIVE_CONNECTOR_KEY)

    if (!connectorName) {
      console.info('Unable to find connector from local storage')

      return
    }

    if (connectorName === ConnectorNames.BSC) {
      // window.BinanceChain might not be imediately available on page load
      const isConnectorBinanceChain = connectorName === ConnectorNames.BSC
      const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

      if (isConnectorBinanceChain && !isBinanceChainDefined) {
        _binanceChainListener().then(() => { return login(connectorName) })

        return
      }
    }

    login(connectorName)
  }, [login])
}
