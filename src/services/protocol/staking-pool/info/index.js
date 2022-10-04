import { getKeys } from './keys'
import { utils } from '@neptunemutual/sdk'
import { stringifyProps } from '../../../../utils/props'

export const getInfo = async (chainId, type, poolKey, account, provider) => {
  try {
    const candidates = await getKeys(chainId, poolKey, account, provider)
    const result = await utils.store.readStorage(chainId, candidates, provider)

    return stringifyProps(result)
  } catch (error) {
    console.error(error)
    throw error
  }
}
