import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'

import { useActivePolicies } from '../useActivePolicies'

describe('useActivePolicies', () => {
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()

  test('while fetching w/o account', async () => {
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })

    const { result } = await renderHookWrapper(useActivePolicies)

    expect(result.data.activePolicies).toEqual([])
    expect(result.data.totalActiveProtection.toString()).toEqual('0')
    expect(result.loading).toBe(false)
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.getActivePolicies()

    const { result } = await renderHookWrapper(useActivePolicies, [], true)

    expect(result.data.activePolicies).toEqual([
      ...testData.activePolicies.data.activePolicies
    ])
    expect(result.data.totalActiveProtection.toString()).toEqual(
      testData.activePolicies.data.totalActiveProtection
    )
  })

  test('while fetching error', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.getActivePolicies(() => { return [] })

    const { result } = await renderHookWrapper(useActivePolicies, [], true)

    expect(result.data.activePolicies).toEqual([])
    expect(result.data.totalActiveProtection.toString()).toEqual('0')
  })
})
