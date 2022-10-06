import { getKeys } from './keys'
import sdk, { utils, multicall } from '@neptunemutual/sdk'
import { stringifyProps } from '../../../../utils/props'
import { MULTIPLIER } from '@/src/config/constants'
import { sumOf } from '@/utils/bn'

const getAmountsInPool = async (chainId, payload, policy, provider) => {
  try {
    const { Contract, Provider } = multicall

    const multiCallProvider = new Provider(provider)
    await multiCallProvider.init()

    const policyContract = new Contract(policy, sdk.config.abis.IPolicy)

    const calls = payload.map(cover => policyContract.getAvailableLiquidity(cover.coverKey))
    const amounts = await multiCallProvider.all(calls)

    return payload.map((cover, idx) => {
      return {
        ...cover,
        totalAmountInPool: amounts[idx]
      }
    })
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param {{coverKey:string, productKeys: string[]}[]} payload
 */
export const getTotalCoverage = async (chainId, payload, provider) => {
  try {
    const all = getKeys(payload.filter(cover => {
      return cover.productKeys && cover.productKeys.length > 0
    }))

    const props = await utils.store.readStorage(chainId, all, provider)
    const storeData = stringifyProps(props)

    const result1 = payload.map((cover) => {
      if (!cover.productKeys || cover.productKeys.length === 0) {
        return cover
      }

      const efficiencies = cover.productKeys.map(productKey => {
        return storeData[`${cover.coverKey}-${productKey}`]
      })

      return {
        ...cover,
        leverage: storeData[`${cover.coverKey}-leverage`],
        medianEfficiency: sumOf(...efficiencies).dividedBy(efficiencies.length).toString()
      }
    })

    const result2 = await getAmountsInPool(chainId, result1, storeData.policy, provider)

    const result3 = result2.map((cover) => {
      if (!cover.productKeys || cover.productKeys.length === 0) {
        return {
          ...cover,
          tvl: cover.totalAmountInPool
        }
      }

      const tvl = cover.totalAmountInPool
        .mul(cover.leverage)
        .mul(cover.medianEfficiency)
        .div(MULTIPLIER)
        .toString()

      return {
        ...cover,
        tvl
      }
    })

    return sumOf(...result3.map(x => x.tvl)).toString()
  } catch (error) {
    console.error(error)
  }
}
