import { getKeys } from './keys'
import { utils } from '@neptunemutual/sdk'
import { stringifyProps } from '../../../../utils/props'

export const getInfo = async (chainId, account, provider) => {
  try {
    const all = await getKeys(account)

    const result = await utils.store.readStorage(chainId, all, provider)

    return stringifyProps(result)
  } catch (error) {
    console.error(error)
  }
}
