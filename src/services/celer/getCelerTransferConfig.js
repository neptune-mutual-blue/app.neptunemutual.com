import { getConfigUrl } from '@/src/config/bridge/celer'
import { getNetworkInfo } from '@/utils/network'

const parseBridgeTokens = (data, tokenSymbol) => {
  const bridgeTokens = {}
  Object.keys(data).forEach(chain => {
    const chainTokenArray = data[chain].token
    const usdcToken = chainTokenArray.find(token => {
      return token.token.symbol === tokenSymbol
    })
    if (usdcToken) {
      bridgeTokens[chain] = {
        address: usdcToken.token.address,
        decimal: usdcToken.token.decimal
      }
    }

    return null
  })

  return bridgeTokens
}

const parseBridgeContracts = (data) => {
  const bridgeContracts = {}
  data.forEach(item => {
    bridgeContracts[item.id] = item.contract_addr

    return null
  })

  return bridgeContracts
}

export const getCelerTransferConfigs = async (networkId, tokenSymbol) => {
  const { isTestNet } = getNetworkInfo(networkId)

  const url = getConfigUrl(isTestNet)
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
    const data = await res.json()
    if (!data.err) {
      const bridgeTokens = parseBridgeTokens(data.chain_token, tokenSymbol)
      const bridgeContracts = parseBridgeContracts(data.chains)

      return {
        bridgeTokens, bridgeContracts
      }
    }
  } catch (err) {
    console.error(`Error in fetching celer configs: ${err}`)
  }

  return {
    bridgeTokens: {},
    bridgeContracts: {}
  }
}
