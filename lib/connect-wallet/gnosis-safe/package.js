import { AbstractConnector } from '@web3-react/abstract-connector'
import SafeAppsSDK from '@gnosis.pm/safe-apps-sdk'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'

export class NoSafeContext extends Error {
  constructor () {
    super()
    this.name = this.constructor.name
    this.message = 'The app is loaded outside safe context'
  }
}

export class UserRejectedRequestError extends Error {
  constructor () {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

class SafeAppConnector extends AbstractConnector {
  constructor (opts) {
    super()
    this.sdk = new SafeAppsSDK(opts)
  }

  async activate () {
    const runningAsSafeApp = await this.isSafeApp()
    if (!runningAsSafeApp) {
      throw new NoSafeContext()
    }

    return { provider: await this.getProvider(), chainId: await this.getChainId(), account: await this.getAccount() }
  }

  async getSafeInfo () {
    if (!this.safe) {
      this.safe = await this.sdk.safe.getInfo()
    }

    return this.safe
  }

  async getProvider () {
    if (!this.provider) {
      const safe = await this.getSafeInfo()
      this.provider = new SafeAppProvider(safe, this.sdk)
    }

    return this.provider
  }

  async getChainId () {
    const provider = await this.getProvider()

    return provider.chainId
  }

  async getAccount () {
    const safe = await this.getSafeInfo()

    return safe.safeAddress
  }

  deactivate () {

  }

  async isSafeApp () {
    // check if we're in an iframe
    if ((window === null || window === undefined ? undefined : window.parent) === window) {
      return false
    }
    const safe = await Promise.race([
      this.getSafeInfo(),
      new Promise((resolve) => { return setTimeout(resolve, 300) })
    ])

    return !!safe
  }
}

export { SafeAppConnector }
