import { useBondPoolAddress } from '@/src/hooks/contracts/useBondPoolAddress'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useBondPoolAddress', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.BondPool.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })

    const { result } = await renderHookWrapper(useBondPoolAddress)

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()

    const { result } = await renderHookWrapper(useBondPoolAddress, [], true)

    expect(result).toBe(testData.bondPoolAddress)
  })
})
