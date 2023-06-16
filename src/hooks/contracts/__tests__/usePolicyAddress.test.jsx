import { usePolicyAddress } from '@/src/hooks/contracts/usePolicyAddress'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'

jest.mock('@neptunemutual/sdk')

describe('useClaimsProcessorAddress', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.PolicyContract.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })

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
