import { useTokenStakingPools } from '@/src/hooks/useTokenStakingPools'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

const mockReturnData = {
  data: {
    pools: [
      {
        id: 'x2314423423'
      }
    ]
  }
}

describe('useTokenStakingPools', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.getGraphURL()

  test('while fetching w/o networkId', async () => {
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })

    const { result } = await renderHookWrapper(useTokenStakingPools, [], true)

    expect(result.handleShowMore).toEqual(expect.any(Function))
    expect(result.hasMore).toBe(false)
    expect(result.data.pools).toEqual([])
    expect(result.loading).toBe(false)
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useNetwork()
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result } = await renderHookWrapper(useTokenStakingPools, [], true)

    expect(result.data.pools).toEqual([...mockReturnData.data.pools])
  })

  test('while fetching error', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(useTokenStakingPools, [], true)

    expect(result.handleShowMore).toEqual(expect.any(Function))
    expect(result.hasMore).toBe(true)
    expect(result.data.pools).toEqual([])
    expect(result.loading).toBe(false)
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })

  test('calling handleShowMore function', async () => {
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result, act } = await renderHookWrapper(
      useTokenStakingPools,
      [],
      true
    )

    await act(async () => {
      await result.handleShowMore()
    })

    expect(result.data.pools).toEqual([...mockReturnData.data.pools])
  })
})
