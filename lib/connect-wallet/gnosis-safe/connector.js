import { SafeAppConnector } from './package'

/**
 *
 * @param {number} chainId
 */
export const getConnector = (chainId) => {
  return new SafeAppConnector({ supportedChainIds: [chainId] })
}
