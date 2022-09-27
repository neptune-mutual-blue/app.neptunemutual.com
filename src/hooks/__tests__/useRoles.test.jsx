import { useRoles } from '@/src/hooks/useRoles'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useRoles', () => {
  mockFn.useWeb3React()
  mockFn.useNetwork()
  mockFn.useErrorNotifier()
  mockFn.sdk.registry.Protocol.getAddress()

  const mockMulticallResult = [true, false, true, true]
  mockFn.sdk.multicall({ all: () => Promise.resolve(mockMulticallResult) })

  test('should return correct data', async () => {
    const { result } = await renderHookWrapper(useRoles, [], true)

    expect(result.isGovernanceAgent).toEqual(mockMulticallResult[0])
    expect(result.isGovernanceAdmin).toEqual(mockMulticallResult[1])
    expect(result.isLiquidityManager).toEqual(mockMulticallResult[2])
    expect(result.isCoverManager).toEqual(mockMulticallResult[3])
  })

  test('should return default data if no network', async () => {
    mockFn.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useRoles, [])

    expect(result.isGovernanceAgent).toEqual(false)
    expect(result.isGovernanceAdmin).toEqual(false)
    expect(result.isLiquidityManager).toEqual(false)
    expect(result.isCoverManager).toEqual(false)

    mockFn.useNetwork()
  })

  test('should call notifyError function if error raised', async () => {
    mockFn.sdk.multicall({ all: () => Promise.reject('ERROR') })

    await renderHookWrapper(useRoles, [])
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
  })
})
