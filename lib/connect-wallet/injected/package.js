/* eslint-disable no-prototype-builtins */
// Forked from: https://github.com/Uniswap/web3-react/blob/v6/packages/injected-connector/src/index.ts

import { getInjectedProvider } from '@/lib/connect-wallet/providers'
import { isProduction } from '@/src/config/constants'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

const __DEV__ = !isProduction

function parseSendReturn (sendReturn) {
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}

export class NoEthereumProviderError extends Error {
  constructor () {
    super()
    this.name = this.constructor.name
    this.message = 'No injected provider was found on window.ethereum.'
  }
}

export class UserRejectedRequestError extends Error {
  constructor () {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

export class InjectedConnector extends AbstractConnector {
  constructor (kwargs) {
    super(kwargs)
    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleChainChanged (chainId) {
    if (__DEV__) {
      console.log("Handling 'chainChanged' event with payload", chainId)
    }
    this.emitUpdate({ chainId, provider: getInjectedProvider() })
  }

  handleAccountsChanged (accounts) {
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts)
    }
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  handleClose (code, reason) {
    if (__DEV__) {
      console.log("Handling 'close' event with payload", code, reason)
    }
    this.emitDeactivate()
  }

  handleNetworkChanged (networkId) {
    if (__DEV__) {
      console.log("Handling 'networkChanged' event with payload", networkId)
    }
    this.emitUpdate({ chainId: networkId, provider: getInjectedProvider() })
  }

  async activate () {
    const provider = getInjectedProvider()

    if (!provider) {
      throw new NoEthereumProviderError()
    }
    if (provider.on) {
      provider.on('chainChanged', this.handleChainChanged)
      provider.on('accountsChanged', this.handleAccountsChanged)
      provider.on('close', this.handleClose)
      provider.on('networkChanged', this.handleNetworkChanged)
    }

    if (provider.isMetaMask) {
      provider.autoRefreshOnNetworkChange = false
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await provider.send('eth_requestAccounts').then(sendReturn => { return parseSendReturn(sendReturn)[0] })
    } catch (error) {
      if (error.code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
    }

    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await provider.enable().then(sendReturn => { return sendReturn && parseSendReturn(sendReturn)[0] })
    }

    return Object.assign({ provider: provider }, (account ? { account } : {}))
  }

  async getProvider () {
    return getInjectedProvider()
  }

  async getChainId () {
    const provider = getInjectedProvider()

    if (!provider) {
      throw new NoEthereumProviderError()
    }
    let chainId
    try {
      chainId = await provider.send('eth_chainId').then(parseSendReturn)
    } catch (_a) {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await provider.send('net_version').then(parseSendReturn)
      } catch (_b) {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }
    if (!chainId) {
      try {
        chainId = parseSendReturn(provider.send({ method: 'net_version' }))
      } catch (_c) {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }
    if (!chainId) {
      if (provider.isDapper) {
        chainId = parseSendReturn(provider.cachedResults.net_version)
      } else {
        chainId = provider.chainId ||
          provider.netVersion ||
          provider.networkVersion ||
          provider._chainId
      }
    }

    return chainId
  }

  async getAccount () {
    const provider = getInjectedProvider()

    if (!provider) {
      throw new NoEthereumProviderError()
    }
    let account
    try {
      account = await provider.send('eth_accounts').then(sendReturn => { return parseSendReturn(sendReturn)[0] })
    } catch (_a) {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }
    if (!account) {
      try {
        account = await provider.enable().then(sendReturn => { return parseSendReturn(sendReturn)[0] })
      } catch (_b) {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }
    if (!account) {
      account = parseSendReturn(provider.send({ method: 'eth_accounts' }))[0]
    }

    return account
  }

  deactivate () {
    const provider = getInjectedProvider()

    if (provider && provider.removeListener) {
      provider.removeListener('chainChanged', this.handleChainChanged)
      provider.removeListener('accountsChanged', this.handleAccountsChanged)
      provider.removeListener('close', this.handleClose)
      provider.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  async isAuthorized () {
    const provider = getInjectedProvider()

    if (!provider) {
      return false
    }
    try {
      return await provider.send('eth_accounts').then(sendReturn => {
        if (parseSendReturn(sendReturn).length > 0) {
          return true
        } else {
          return false
        }
      })
    } catch (_a) {
      return false
    }
  }
}
