import { BscConnector } from './package'

export const getConnector = (chainId) => {
  return new BscConnector({ supportedChainIds: [chainId] })
}
