import { getKeys, getMetadataKeys } from './keys'
import { utils } from '@neptunemutual/sdk'
import { stringifyProps } from '../../../../utils/props'

export const getStats = async (
  chainId,
  coverKey,
  productKey,
  account,
  provider
) => {
  try {
    const metadataKeys = getMetadataKeys()
    const metadataResult = await utils.store.readStorage(
      chainId,
      metadataKeys,
      provider
    )

    const all = await getKeys(
      provider,
      coverKey,
      productKey,
      account,
      metadataResult
    )
    const result = await utils.store.readStorage(chainId, all, provider)

    return stringifyProps(result)
  } catch (error) {
    console.error(error)
  }
}
