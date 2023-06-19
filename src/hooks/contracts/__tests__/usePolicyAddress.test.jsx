import { usePolicyAddress } from '@/src/hooks/contracts/usePolicyAddress'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useClaimsProcessorAddress', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.PolicyContract.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ ...testData.account, account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(usePolicyAddress)

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()

    const { result } = await renderHookWrapper(usePolicyAddress, [], true)

    expect(result).toBe('PolicyContract getAddress() mock')
  })
})
