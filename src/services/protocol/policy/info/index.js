import { getKeys } from './keys'
import { utils } from '@neptunemutual/sdk'
import { stringifyProps } from '@/utils/props'

export const getPolicyInfo = async (
  chainId,
  coverKey,
  productKey,
  provider
) => {
  try {
    const candidates = await getKeys(coverKey, productKey)
    const result = await utils.store.readStorage(chainId, candidates, provider)

    return stringifyProps(result)
  } catch (error) {
    console.error(error)
    throw error
  }
}
