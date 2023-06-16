import { useLiquidityTxs } from '@/src/hooks/useLiquidityTxs'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useLiquidityTxs', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()

  beforeEach(() => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.getGraphURL()
  })

  const args = [
    {
      limit: 10,
      page: 1
    }
  ]

  test('should return default data', async () => {
    mockGlobals.fetch()

    const { result } = await renderHookWrapper(useLiquidityTxs, args, true)

    expect(result.hasMore).toBe(true)
    expect(result.data.blockNumber).toEqual(null)
    expect(result.data.transactions).toEqual([])
    expect(result.data.totalCount).toEqual(0)
    expect(result.loading).toEqual(false)

    mockGlobals.fetch().unmock()
  })

  test('should return correct data as received from api', async () => {
    const mockData = {
      data: {
        liquidityTransactions: [{ id: 1 }, { id: 2 }],
        _meta: { block: { number: 1234 } }
      }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useLiquidityTxs, args, true)

    const isLastPage =
      mockData.data.liquidityTransactions.length === 0 ||
      mockData.data.liquidityTransactions.length < args[0].limit
    expect(result.hasMore).toBe(!isLastPage)
    expect(result.data.blockNumber).toEqual(mockData.data._meta.block.number)
    expect(result.data.transactions).toEqual(
      mockData.data.liquidityTransactions
    )
    expect(result.data.totalCount).toEqual(
      mockData.data.liquidityTransactions.length
    )

    mockGlobals.fetch().unmock()
  })

  describe('Edge cases coverage', () => {
    test('should return if no account', async () => {
      mockHooksOrMethods.useWeb3React(() => { return { account: null } })

      const { result } = await renderHookWrapper(useLiquidityTxs, args)
      expect(result.data.transactions).toEqual([])

      mockHooksOrMethods.useWeb3React()
    })

    test('should not set hasMore to false if transactions length is equal to limit', async () => {
      const mockData = {
        data: {
          liquidityTransactions: [{ id: 1 }, { id: 2 }],
          _meta: { block: { number: 1234 } }
        }
      }
      mockGlobals.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(useLiquidityTxs, [
        { page: 1, limit: 2 }
      ])

      expect(result.hasMore).toEqual(true)
      mockGlobals.fetch().unmock()
    })

    test('should log error in case of api error', async () => {
      mockGlobals.fetch(false)
      mock()

      await renderHookWrapper(useLiquidityTxs, args)

      expect(mockFunction).toHaveBeenCalled()

      mockGlobals.fetch().unmock()
      restore()
    })
  })
})
