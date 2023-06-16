import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useActivePoliciesByCover } from '../useActivePoliciesByCover'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockProps = {
  coverKey:
    '0x7072696d65000000000000000000000000000000000000000000000000000000',
  productKey:
    '0x62616c616e636572000000000000000000000000000000000000000000000000',
  page: 1,
  limit: 50
}

const mockReturnData = {
  data: {
    userPolicies: [
      {
        totalAmountToCover: '1000'
      }
    ]
  }
}

describe('useActivePoliciesByCover', () => {
  const { mock, restore, mockFunction } = mockGlobals.console.error()

  test('while fetching w/o account, networkId and graphURL', async () => {
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
    mockHooksOrMethods.getGraphURL(() => { return '' })

    const { result } = await renderHookWrapper(useActivePoliciesByCover, [
      mockProps
    ])

    expect(result.data.activePolicies).toEqual([])
    expect(result.data.totalActiveProtection.toString()).toEqual('0')
    expect(result.loading).toBe(false)
    expect(result.hasMore).toBe(true)
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.getGraphURL()
    mockGlobals.fetch(true, undefined, mockReturnData)

    const { result } = await renderHookWrapper(
      useActivePoliciesByCover,
      [mockProps],
      true
    )

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

    const { result } = await renderHookWrapper(
      useActivePoliciesByCover,
      [mockProps],
      true
    )

    expect(result.data.activePolicies).toEqual([])
    expect(result.data.totalActiveProtection.toString()).toEqual('0')
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
