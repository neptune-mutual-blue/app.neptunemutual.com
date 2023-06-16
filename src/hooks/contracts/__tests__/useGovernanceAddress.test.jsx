import {
  useGovernanceAddress
} from '@/src/hooks/contracts/useGovernanceAddress'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useGovernanceAddress', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.Governance.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useGovernanceAddress)

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()

    const { result } = await renderHookWrapper(useGovernanceAddress, [], true)

    expect(result).toBe(testData.governanceAddress)
  })
})
