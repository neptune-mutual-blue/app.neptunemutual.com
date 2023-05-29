import { useExpiredPolicies } from '@/src/hooks/useExpiredPolicies'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useExpiredPolicies', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.getGraphURL()

  test('should return default value when null data returned from api', async () => {
    const mockData = { data: null }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useExpiredPolicies)
    expect(result.data).toEqual([])
    expect(result.loading).toEqual(false)

    mockGlobals.fetch().unmock()
  })

  test('should return result when data received from api', async () => {
    const mockData = {
      data: { expiredPolicies: [{ id: 1, policyName: 'my-policy' }] }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useExpiredPolicies, [], true)
    expect(result.data).toEqual(mockData.data)
    expect(result.loading).toEqual(false)
  })

  test('should return if no account data available', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))

    const { result } = await renderHookWrapper(useExpiredPolicies, [])
    expect(result.data).toEqual([])

    mockHooksOrMethods.useWeb3React()
  })

  test('should log error if error occurs in api', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(useExpiredPolicies, [], true)
    expect(result.data).toEqual([])
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
