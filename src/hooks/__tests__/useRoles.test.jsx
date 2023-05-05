import { useRoles } from '@/src/hooks/useRoles'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useRoles', () => {
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useErrorNotifier()
  mockSdk.registry.Protocol.getAddress()

  const mockMulticallResult = [true, false, true, true]
  mockSdk.multicall({ all: () => Promise.resolve(mockMulticallResult) })

  test('should return correct data', async () => {
    const { result } = await renderHookWrapper(useRoles, [], true)

    expect(result.isGovernanceAgent).toEqual(mockMulticallResult[0])
    expect(result.isGovernanceAdmin).toEqual(mockMulticallResult[1])
    expect(result.isLiquidityManager).toEqual(mockMulticallResult[2])
    expect(result.isCoverManager).toEqual(mockMulticallResult[3])
  })

  test('should return default data if no network', async () => {
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useRoles, [])

    expect(result.isGovernanceAgent).toEqual(false)
    expect(result.isGovernanceAdmin).toEqual(false)
    expect(result.isLiquidityManager).toEqual(false)
    expect(result.isCoverManager).toEqual(false)

    mockHooksOrMethods.useNetwork()
  })

  test('should call notifyError function if error raised', async () => {
    mockSdk.multicall({ all: () => Promise.reject(new Error('Something went wrong')) })

    await renderHookWrapper(useRoles, [])
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
  })
})
