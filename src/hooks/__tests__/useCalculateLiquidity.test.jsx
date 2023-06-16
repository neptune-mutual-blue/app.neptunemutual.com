import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

import { useCalculateLiquidity } from '../useCalculateLiquidity'

const mockProps = {
  coverKey:
    '0x7072696d65000000000000000000000000000000000000000000000000000000',
  podAmount: 1000
}

const mockReturnData = {
  receiveAmount: '0',
  loading: false
}

jest.mock('@neptunemutual/sdk')

describe('useCalculateLiquidity', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.Vault.getInstance()
  mockHooksOrMethods.useErrorNotifier()

  test('while fetching w/o networkId, account, debouncedValue', async () => {
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
    mockHooksOrMethods.useDebounce(null)

    const { result } = await renderHookWrapper(useCalculateLiquidity, [
      mockProps
    ])

    expect(result.receiveAmount).toEqual(mockReturnData.receiveAmount)
    expect(result.loading).toEqual(mockReturnData.loading)
  })

  test('while fetching successful ', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useDebounce()
    mockHooksOrMethods.useTxPoster()

    const { result } = await renderHookWrapper(
      useCalculateLiquidity,
      [mockProps],
      true
    )

    const amount = await (await testData.txPoster.contractRead()).toString()

    expect(result.receiveAmount.toString()).toEqual(amount)
  })

  test('while fetching is not mounted ', async () => {
    mockHooksOrMethods.useMountedState()
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useDebounce()
    mockHooksOrMethods.useTxPoster()

    const { result } = await renderHookWrapper(
      useCalculateLiquidity,
      [mockProps],
      true
    )

    expect(result.receiveAmount).toEqual(mockReturnData.receiveAmount)
    expect(result.loading).toEqual(mockReturnData.loading)
  })

  test('while fetching error ', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useDebounce()
    mockHooksOrMethods.useTxPoster(() => {
      return {
        ...testData.txPoster,
        contractRead: undefined
      }
    })

    const { result } = await renderHookWrapper(
      useCalculateLiquidity,
      [mockProps],
      true
    )

    expect(result.receiveAmount).toEqual(mockReturnData.receiveAmount)
    expect(result.loading).toEqual(mockReturnData.loading)
  })
})
