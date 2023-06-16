import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

import { useUnstakeReportingStake } from '../useUnstakeReportingStake'

const mockProps = {
  coverKey:
    '0x7072696d65000000000000000000000000000000000000000000000000000000',
  productKey:
    '0x6161766500000000000000000000000000000000000000000000000000000000',
  incidentDate: new Date().getTime(),
  willReceive: '1000'
}

jest.mock('@neptunemutual/sdk')

describe('useUnstakeReportingStake', () => {
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useAuthValidation()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useErrorNotifier()
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.Resolution.getInstance()
  mockHooksOrMethods.useAppConstants()

  test('calling unstake function w/o networkId and account', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps
    ])

    await act(async () => {
      await result.unstake()
    })

    expect(result.unstake).toEqual(expect.any(Function))
    expect(result.unstakeWithClaim).toEqual(expect.any(Function))
    expect(result.unstaking).toBe(false)
  })

  test('calling unstake function w/networkId and account', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useRouter()

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps
    ])

    await act(async () => {
      await result.unstake()
    })

    expect(result.unstake).toEqual(expect.any(Function))
  })

  test('calling unstake function w/networkId and account and error', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined
    }))

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps
    ])

    await act(async () => {
      await result.unstake()
    })

    expect(result.unstake).toEqual(expect.any(Function))
  })

  test('calling unstakeWithClaim function w/o networkId and account', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps
    ])

    await act(async () => {
      await result.unstakeWithClaim()
    })

    expect(result.unstake).toEqual(expect.any(Function))
    expect(result.unstakeWithClaim).toEqual(expect.any(Function))
    expect(result.unstaking).toBe(false)
  })

  test('calling unstakeWithClaim function w/networkId and account', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps
    ])

    await act(async () => {
      await result.unstakeWithClaim()
    })

    expect(result.unstakeWithClaim).toEqual(expect.any(Function))
  })

  test('calling unstakeWithClaim function w/networkId and account and error', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined
    }))

    const { result, act } = await renderHookWrapper(useUnstakeReportingStake, [
      mockProps
    ])

    await act(async () => {
      await result.unstakeWithClaim()
    })

    expect(result.unstakeWithClaim).toEqual(expect.any(Function))
  })
})
