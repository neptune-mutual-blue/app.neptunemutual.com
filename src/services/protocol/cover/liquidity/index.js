import { getKeys } from './keys'
import sdk, { registry, utils, multicall } from '@neptunemutual/sdk'
import { stringifyProps } from '../../../../utils/props'
import { MULTIPLIER } from '@/src/config/constants'
import { sumOf } from '@/utils/bn'

const getAmountsInPool = async (chainId, payload, provider) => {
  try {
    const { Contract, Provider } = multicall

    const multiCallProvider = new Provider(provider)
    await multiCallProvider.init()

    const policy = await registry.PolicyContract.getAddress(chainId, provider)
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
export const getDiversifiedLiquidityInfo = async (chainId, payload, provider) => {
  try {
    const all = getKeys(payload)

    const props = await utils.store.readStorage(chainId, all, provider)
    const leverageAndEfficiencies = stringifyProps(props)

    const result1 = payload.map((cover) => {
      const efficiencies = cover.productKeys.map(productKey => {
        return leverageAndEfficiencies[`${cover.coverKey}-${productKey}`]
      })

      return {
        ...cover,
        leverage: leverageAndEfficiencies[`${cover.coverKey}-leverage`],
        medianEfficiency: sumOf(...efficiencies).dividedBy(efficiencies.length).toString()
      }
    })

    const result2 = await getAmountsInPool(chainId, result1, provider)

    return result2.map((cover) => {
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
  } catch (error) {
    console.error(error)
  }
}

/**
 * @param {{coverKey:string}[]} payload
 */
export const getDedicatedLiquidityInfo = async (chainId, payload, provider) => {
  try {
    const result = await getAmountsInPool(chainId, payload, provider)

    return result.map((cover) => {
      return {
        ...cover,
        tvl: cover.totalAmountInPool
      }
    })
  } catch (error) {
    console.error(error)
  }
}
