import { InjectedConnector } from './package'

/**
 *
 * @param {number} chainId
 */
export const getConnector = (chainId) => {
  return new InjectedConnector({ supportedChainIds: [chainId] })
}
