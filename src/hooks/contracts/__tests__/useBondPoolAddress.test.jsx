import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'
import { useBondPoolAddress } from '@/src/hooks/contracts/useBondPoolAddress'
import { testData } from '@/utils/unit-tests/test-data'

describe('useBondPoolAddress', () => {
  mockFn.utilsWeb3.getProviderOrSigner()
  mockFn.sdk.registry.BondPool.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockFn.useWeb3React(() => ({ account: null }))
    mockFn.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useBondPoolAddress)

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockFn.useWeb3React()
    mockFn.useNetwork()

    const { result } = await renderHookWrapper(useBondPoolAddress, [], true)

    expect(result).toBe(testData.bondPoolAddress)
  })
})
