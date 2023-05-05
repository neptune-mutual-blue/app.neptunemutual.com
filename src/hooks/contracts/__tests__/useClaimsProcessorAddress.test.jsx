import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { useClaimsProcessorAddress } from '@/src/hooks/contracts/useClaimsProcessorAddress'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useClaimsProcessorAddress', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.ClaimsProcessor.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useClaimsProcessorAddress)

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()

    const { result } = await renderHookWrapper(
      useClaimsProcessorAddress,
      [],
      true
    )

    expect(result).toBe(testData.claimsProcessorAddress)
  })
})
