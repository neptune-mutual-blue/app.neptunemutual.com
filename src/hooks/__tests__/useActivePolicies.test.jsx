import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useActivePolicies } from '../useActivePolicies'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockReturnData = {
  data: {
    userPolicies: [
      {
        totalAmountToCover: '1000'
      }
    ]
  }
}

describe('useActivePolicies', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()

  test('while fetching w/o account', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))

    const { result } = await renderHookWrapper(useActivePolicies)

    expect(result.data.activePolicies).toEqual([])
    expect(result.data.totalActiveProtection.toString()).toEqual('0')
    expect(result.loading).toBe(false)
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result } = await renderHookWrapper(useActivePolicies, [], true)

    expect(result.data.activePolicies).toEqual([
      ...mockReturnData.data.userPolicies
    ])
    expect(result.data.totalActiveProtection.toString()).toEqual(
      mockReturnData.data.userPolicies[0].totalAmountToCover
    )
  })

  test('while fetching error', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(useActivePolicies, [], true)

    expect(result.data.activePolicies).toEqual([])
    expect(result.data.totalActiveProtection.toString()).toEqual('0')
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
