import { usePodStakingPools } from '@/src/hooks/usePodStakingPools'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('usePodStakingPools', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()

  test('should return default hook result', async () => {
    mockGlobals.fetch()
    const { result } = await renderHookWrapper(usePodStakingPools)

    expect(result.data).toEqual({ pools: [] })
    expect(result.hasMore).toEqual(true)
    expect(result.loading).toEqual(false)
    expect(typeof result.handleShowMore).toBe('function')

    mockGlobals.fetch().unmock()
  })

  test('should be able to call handleShowMore function', async () => {
    mockGlobals.fetch()
    const { result, act } = await renderHookWrapper(usePodStakingPools)

    await act(async () => { return await result.handleShowMore() })

    mockGlobals.fetch().unmock()
  })

  describe('Edge cases coverage', () => {
    test('should set hasMore to false if networkId', async () => {
      mockHooksOrMethods.useNetwork(() => { return { networkId: null } })

      const { result } = await renderHookWrapper(usePodStakingPools, [], true)
      expect(result.hasMore).toEqual(false)

      mockHooksOrMethods.useNetwork()
    })

    test('should set pools data as provided by api', async () => {
      const mockData = { data: { pools: [1, 2, 3, 4, 5, 6] } }
      mockGlobals.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(usePodStakingPools, [], true)
      expect(result.data).toEqual(mockData.data)

      mockGlobals.fetch().unmock()
    })

    test('should set hasMore to false if pools data is empty', async () => {
      const mockData = { data: { pools: [] } }
      mockGlobals.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(usePodStakingPools, [], true)
      expect(result.hasMore).toEqual(false)

      mockGlobals.fetch().unmock()
    })

    test('should log error when error is thrown from api', async () => {
      mockGlobals.fetch(false)
      mock()

      await renderHookWrapper(usePodStakingPools, [], true)
      expect(mockFunction).toHaveBeenCalled()

      mockGlobals.fetch().unmock()
      restore()
    })
  })
})
