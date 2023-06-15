import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

import { useCapitalizePool } from '../useCapitalizePool'

const mockProps = {
  coverKey:
    '0x7072696d65000000000000000000000000000000000000000000000000000000',
  productKey:
    '0x62616c616e636572000000000000000000000000000000000000000000000000',
  incidentDate: ''
}

jest.mock('@neptunemutual/sdk')

describe('useCapitalizePool', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.Reassurance.getInstance()
  mockHooksOrMethods.useErrorNotifier()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))
    mockHooksOrMethods.useAuthValidation()

    const { result, act } = await renderHookWrapper(useCapitalizePool, [
      mockProps
    ])

    await act(async () => {
      await result.capitalize()
    })

    expect(result.capitalize).toEqual(expect.any(Function))
    expect(result.capitalizing).toBe(false)
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useTxPoster()
    mockHooksOrMethods.useTxToast()

    const { result, act } = await renderHookWrapper(
      useCapitalizePool,
      [mockProps],
      false
    )

    await act(async () => {
      await result.capitalize()
    })

    expect(result.capitalize).toEqual(expect.any(Function))
    expect(result.capitalizing).toBe(false)
  })

  test('while fetching error', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined
    }))
    mockHooksOrMethods.useTxToast()

    const { result, act } = await renderHookWrapper(
      useCapitalizePool,
      [mockProps],
      false
    )

    await act(async () => {
      await result.capitalize()
    })

    expect(result.capitalize).toEqual(expect.any(Function))
    expect(result.capitalizing).toBe(false)
  })
})
