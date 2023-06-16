import { useVaultAddress } from '@/src/hooks/contracts/useVaultAddress'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useVaultAddress', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.Vault.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useVaultAddress, [
      {
        coverKey:
          '0x616e696d617465642d6272616e64730000000000000000000000000000000000'
      }
    ])

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()

    const { result } = await renderHookWrapper(
      useVaultAddress,
      [
        {
          coverKey:
            '0x616e696d617465642d6272616e64730000000000000000000000000000000000'
        }
      ],
      true
    )

    expect(result).toBe(testData.vaultAddress)
  })
})
