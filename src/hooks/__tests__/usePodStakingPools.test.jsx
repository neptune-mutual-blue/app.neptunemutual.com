import { usePodStakingPools } from '@/src/hooks/usePodStakingPools'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('usePodStakingPools', () => {
  const { mock, mockFunction, restore } = mockFn.console.error()
  mockFn.useNetwork()
  mockFn.getGraphURL()

  test('should return default hook result', async () => {
    mockFn.fetch()
    const { result } = await renderHookWrapper(usePodStakingPools)

    expect(result.data).toEqual({ pools: [] })
    expect(result.hasMore).toEqual(true)
    expect(result.loading).toEqual(false)
    expect(typeof result.handleShowMore).toBe('function')

    mockFn.fetch().unmock()
  })

  test('should be able to call handleShowMore function', async () => {
    mockFn.fetch()
    const { result, act } = await renderHookWrapper(usePodStakingPools)

    await act(async () => await result.handleShowMore())

    mockFn.fetch().unmock()
  })

  describe('Edge cases coverage', () => {
    test('should set hasMore to false if networkId', async () => {
      mockFn.useNetwork(() => ({ networkId: null }))

      const { result } = await renderHookWrapper(usePodStakingPools, [], true)
      expect(result.hasMore).toEqual(false)

      mockFn.useNetwork()
    })

    test('should set pools data as provided by api', async () => {
      const mockData = { data: { pools: [1, 2, 3, 4, 5, 6] } }
      mockFn.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(usePodStakingPools, [], true)
      expect(result.data).toEqual(mockData.data)

      mockFn.fetch().unmock()
    })

    test('should set hasMore to false if pools data is empty', async () => {
      const mockData = { data: { pools: [] } }
      mockFn.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(usePodStakingPools, [], true)
      expect(result.hasMore).toEqual(false)

      mockFn.fetch().unmock()
    })

    test('should log error when error is thrown from api', async () => {
      mockFn.fetch(false)
      mock()

      await renderHookWrapper(usePodStakingPools, [], true)
      expect(mockFunction).toHaveBeenCalled()

      mockFn.fetch().unmock()
      restore()
    })
  })
})
