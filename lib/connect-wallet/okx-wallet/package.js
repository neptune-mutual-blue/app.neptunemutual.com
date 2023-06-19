/* eslint-disable no-prototype-builtins */
// Forked from: https://github.com/Uniswap/web3-react/blob/v6/packages/injected-connector/src/index.ts

import { getOkxWalletProvider } from '@/lib/connect-wallet/providers'
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
    this.message = 'No Ethereum provider was found on window.okxwallet.'
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
    this.emitUpdate({ chainId, provider: window.okxwallet })
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
    this.emitUpdate({ chainId: networkId, provider: window.okxwallet })
  }

  async activate () {
    if (!window.okxwallet) {
      throw new NoEthereumProviderError()
    }
    if (window.okxwallet.on) {
      window.okxwallet.on('chainChanged', this.handleChainChanged)
      window.okxwallet.on('accountsChanged', this.handleAccountsChanged)
      window.okxwallet.on('close', this.handleClose)
      window.okxwallet.on('networkChanged', this.handleNetworkChanged)
    }

    if (window.okxwallet.isMetaMask) {
      window.okxwallet.autoRefreshOnNetworkChange = false
    }
    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await window.okxwallet.send('eth_requestAccounts').then(sendReturn => { return parseSendReturn(sendReturn)[0] })
    } catch (error) {
      if (error.code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
    }
    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await window.okxwallet.enable().then(sendReturn => { return sendReturn && parseSendReturn(sendReturn)[0] })
    }

    return Object.assign({ provider: window.okxwallet }, (account ? { account } : {}))
  }

  async getProvider () {
    return getOkxWalletProvider()
  }

  async getChainId () {
    if (!window.okxwallet) {
      throw new NoEthereumProviderError()
    }
    let chainId
    try {
      chainId = await window.okxwallet.send('eth_chainId').then(parseSendReturn)
    } catch (_a) {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }
    if (!chainId) {
      try {
        chainId = await window.okxwallet.send('net_version').then(parseSendReturn)
      } catch (_b) {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }
    if (!chainId) {
      try {
        chainId = parseSendReturn(window.okxwallet.send({ method: 'net_version' }))
      } catch (_c) {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }
    if (!chainId) {
      if (window.okxwallet.isDapper) {
        chainId = parseSendReturn(window.okxwallet.cachedResults.net_version)
      } else {
        chainId = window.okxwallet.chainId ||
          window.okxwallet.netVersion ||
          window.okxwallet.networkVersion ||
          window.okxwallet._chainId
      }
    }

    return chainId
  }

  async getAccount () {
    if (!window.okxwallet) {
      throw new NoEthereumProviderError()
    }
    let account
    try {
      account = await window.okxwallet.send('eth_accounts').then(sendReturn => { return parseSendReturn(sendReturn)[0] })
    } catch (_a) {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }
    if (!account) {
      try {
        account = await window.okxwallet.enable().then(sendReturn => { return parseSendReturn(sendReturn)[0] })
      } catch (_b) {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }
    if (!account) {
      account = parseSendReturn(window.okxwallet.send({ method: 'eth_accounts' }))[0]
    }

    return account
  }

  deactivate () {
    if (window.okxwallet && window.okxwallet.removeListener) {
      window.okxwallet.removeListener('chainChanged', this.handleChainChanged)
      window.okxwallet.removeListener('accountsChanged', this.handleAccountsChanged)
      window.okxwallet.removeListener('close', this.handleClose)
      window.okxwallet.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  async isAuthorized () {
    if (!window.okxwallet) {
      return false
    }
    try {
      return await window.okxwallet.send('eth_accounts').then(sendReturn => {
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
