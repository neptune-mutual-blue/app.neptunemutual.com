import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

import { useClaimBond } from '../useClaimBond'

jest.mock('@neptunemutual/sdk')

describe('useClaimBond', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.BondPool.getInstance()
  mockHooksOrMethods.useErrorNotifier()
  mockHooksOrMethods.useAppConstants()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })

    const { result, act } = await renderHookWrapper(useClaimBond, ['2000000000'])

    await act(async () => {
      await result.handleClaim(() => {})
    })

    expect(result.handleClaim).toEqual(expect.any(Function))
    expect(result.claiming).toBe(false)
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useTxPoster(() => {
      return {
        ...testData.txPoster,
        writeContract: undefined
      }
    })
    mockHooksOrMethods.useTxToast()

    const { result, act } = await renderHookWrapper(useClaimBond, ['2000000000'])

    await act(async () => {
      await result.handleClaim(() => {})
    })

    expect(result.handleClaim).toEqual(expect.any(Function))
    expect(result.claiming).toBe(false)
  })

  test('while fetching error', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useTxPoster(() => {
      return {
        ...testData.txPoster,
        writeContract: undefined
      }
    })
    mockHooksOrMethods.useTxToast()

    const { result, act } = await renderHookWrapper(useClaimBond, ['2000000000'])

    await act(async () => {
      await result.handleClaim(() => {})
    })

    expect(result.handleClaim).toEqual(expect.any(Function))
    expect(result.claiming).toBe(false)
  })
})
