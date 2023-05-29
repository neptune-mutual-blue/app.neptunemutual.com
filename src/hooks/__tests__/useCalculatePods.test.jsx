import { useCalculatePods } from '../useCalculatePods'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { convertToUnits } from '@/utils/bn'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockProps = {
  coverKey:
    '0x7072696d65000000000000000000000000000000000000000000000000000000',
  value: 100,
  podAddress: '0xBD85714f56622BDec5599BA965E60d01d4943540'
}

describe('useCalculatePods', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.Vault.getInstance()
  mockHooksOrMethods.useErrorNotifier()

  test('while fetching w/o networkId, account, debouncedValue', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))
    mockHooksOrMethods.useDebounce(null)

    const { result } = await renderHookWrapper(useCalculatePods, [mockProps])

    expect(result.receiveAmount).toEqual('0')
    expect(result.loading).toBe(false)
  })

  test('while fetching successful ', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useDebounce()
    mockHooksOrMethods.useTxPoster()
    mockHooksOrMethods.useTokenDecimals()

    const { result } = await renderHookWrapper(
      useCalculatePods,
      [mockProps],
      true
    )

    const amount = await (await testData.txPoster.contractRead()).toString()

    expect(convertToUnits(result.receiveAmount).toString()).toEqual(amount)
  })

  test('while fetching error ', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useDebounce()
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      contractRead: undefined
    }))

    const { result } = await renderHookWrapper(
      useCalculatePods,
      [mockProps],
      true
    )

    expect(result.receiveAmount).toEqual('0')
    expect(result.loading).toBe(false)
  })
})
