import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'
import { useVaultAddress } from '@/src/hooks/contracts/useVaultAddress'

describe('useVaultAddress', () => {
  mockFn.utilsWeb3.getProviderOrSigner()
  mockFn.sdk.registry.Vault.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockFn.useWeb3React(() => ({ account: null }))
    mockFn.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useVaultAddress, [
      {
        coverKey:
          '0x616e696d617465642d6272616e64730000000000000000000000000000000000'
      }
    ])

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockFn.useWeb3React()
    mockFn.useNetwork()

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
