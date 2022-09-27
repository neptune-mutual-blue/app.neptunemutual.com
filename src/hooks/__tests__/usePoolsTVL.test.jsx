import { calcBondPoolTVL } from '@/src/helpers/bond'
import { calcStakingPoolTVL } from '@/src/helpers/pool'
import { getPricingData } from '@/src/helpers/pricing'
import { getNpmPayload } from '@/src/helpers/token'
import { usePoolsTVL } from '@/src/hooks/usePoolsTVL'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('usePoolsTVL', () => {
  const { mock, mockFunction, restore } = mockFn.console.error()
  mockFn.getNetworkId()
  mockFn.getGraphURL()

  const args = ['0xF7c352D9d6967Bd916025030E38eA58cF48029f8']
  const mockFetchData = {
    data: {
      bondPools: [
        {
          id: '0x4e504d2f55534443',
          lpToken: '0x97ccd316db0298498fcfd626b215955b9df44b71',
          totalNpmTopUp: '2000000000000000000000000',
          totalBondClaimed: '1424900465944819115',
          totalLpAddedToBond: '1100000000000'
        }
      ],
      pools: [
        {
          id: '0x4245430000000000000000000000000000000000000000000000000000000000',
          poolType: 'TokenStaking',
          rewardToken: '0xde492aab7797e410547435a6b8886ae7168cf092',
          stakingToken: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
          rewardTokenDeposit: '27000000000000000000000000',
          totalRewardsWithdrawn: '27000000000000000000000000',
          totalStakingTokenDeposited: '103370000000000000000000',
          totalStakingTokenWithdrawn: '0'
        },
        {
          id: '0x4372706f6f6c0000000000000000000000000000000000000000000000000000',
          poolType: 'TokenStaking',
          rewardToken: '0x87f9239dc639dfea56cdbbc489e892bbef5ab866',
          stakingToken: '0xf7c352d9d6967bd916025030e38ea58cf48029f8',
          rewardTokenDeposit: '13400300000000000000000000',
          totalRewardsWithdrawn: '111281046118534600000',
          totalStakingTokenDeposited: '53100000000000000000000',
          totalStakingTokenWithdrawn: '100000000000000000000'
        }
      ]
    }
  }

  test('should return default hook result', async () => {
    mockFn.fetch(true, undefined, { data: { bondPools: [], pools: [] } })

    const { result } = await renderHookWrapper(usePoolsTVL, args)
    expect(result.tvl).toEqual('0')
    expect(typeof result.getTVLById).toEqual('function')
    expect(typeof result.getPriceByAddress).toEqual('function')

    mockFn.fetch().unmock()
  })

  test('should return correct result as expected', async () => {
    mockFn.fetch(true, undefined, mockFetchData)

    const { result } = await renderHookWrapper(usePoolsTVL, args, true)

    const networkId = testData.network.networkId
    const expectedTvl = await (
      await getPricingData(networkId, [
        ...mockFetchData.data.bondPools.map((bondPool) => {
          return calcBondPoolTVL(bondPool, networkId, args[0])
        }),
        ...mockFetchData.data.pools.map((currentPool) => {
          return calcStakingPoolTVL(currentPool)
        }),
        ...getNpmPayload(args[0])
      ])
    ).total
    expect(result.tvl).toEqual(expectedTvl)

    mockFn.fetch().unmock()
  })

  test('should log error when error is raised', async () => {
    mockFn.fetch(false)
    mock()

    await renderHookWrapper(usePoolsTVL, args)
    expect(mockFunction).toHaveBeenCalled()

    mockFn.fetch().unmock()
    restore()
  })

  test('should return default data if no argument provided', async () => {
    const { result } = await renderHookWrapper(usePoolsTVL, [])
    expect(result.tvl).toEqual('0')
  })

  test('should be able to execute getTVLById & getPriceByAddress function', async () => {
    mockFn.fetch(true, undefined, mockFetchData)

    const { result, act } = await renderHookWrapper(usePoolsTVL, args, true)

    await act(async () => {
      await result.getTVLById('0x4e504d2f55534443')
      await result.getPriceByAddress(
        '0x97ccd316db0298498fcfd626b215955b9df44b71'
      )
    })

    mockFn.fetch().unmock()
  })

  test('should return price 0 from getPriceByAddress function if amount is 0', async () => {
    mockFn.fetch(true, undefined, mockFetchData)

    const { result, act } = await renderHookWrapper(usePoolsTVL, args, true)

    await act(async () => {
      const price = await result.getPriceByAddress(
        '0xde492aab7797e410547435a6b8886ae7168cf092'
      )
      expect(price).toEqual('0')
    })

    mockFn.fetch().unmock()
  })

  test('should return price 0 from getPriceByAddress function if address not found', async () => {
    mockFn.fetch(true, undefined, mockFetchData)

    const { result, act } = await renderHookWrapper(usePoolsTVL, args, true)

    await act(async () => {
      const price = await result.getPriceByAddress(
        '0xde492aab7797e410547435dsd6b8886ae7168cf092'
      )
      expect(price).toEqual('0')
    })

    mockFn.fetch().unmock()
  })
})
