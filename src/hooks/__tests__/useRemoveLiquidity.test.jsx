import { useRemoveLiquidity } from '@/src/hooks/useRemoveLiquidity'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useRemoveLiquidity', () => {
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useLiquidityFormsContext()
  mockHooksOrMethods.useERC20Allowance()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useErrorNotifier()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useRouter()
  mockSdk.registry.Vault.getInstance()

  const args = [
    {
      coverKey:
        '0x7072696d65000000000000000000000000000000000000000000000000000000',
      value: '100',
      npmValue: '1000'
    }
  ]

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useRemoveLiquidity, args)

    expect(result.allowance.toString()).toEqual(
      testData.erc20Allowance.allowance.toString()
    )
    expect(result.loadingAllowance).toEqual(false)
    expect(result.approving).toEqual(false)
    expect(result.withdrawing).toEqual(false)
    expect(typeof result.handleApprove).toEqual('function')
    expect(typeof result.handleWithdraw).toEqual('function')
  })

  test('should execute handleApprove function', async () => {
    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args)

    await act(async () => {
      await result.handleApprove()
    })

    expect(testData.erc20Allowance.approve).toHaveBeenCalled()
  })

  test('should execute handleWithdraw function', async () => {
    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args)

    const successCb = jest.fn()
    await act(async () => {
      await result.handleWithdraw(successCb, true)
    })

    expect(successCb).toHaveBeenCalled()
    expect(testData.txPoster.writeContract).toHaveBeenCalled()
  })

  test('should call notifyError when error arises in handleApprove', async () => {
    mockHooksOrMethods.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject(new Error('Something went wrong')))
    }))

    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args)

    await act(async () => {
      await result.handleApprove()
    })
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockHooksOrMethods.useTxToast()
  })

  test('should return when no networkId or account in handleWithdraw', async () => {
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))

    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args)

    const successCb = jest.fn()
    await act(async () => {
      await result.handleWithdraw(successCb, true)
    })

    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
  })

  test('should call notifyError when error in handleWithdraw', async () => {
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null
    }))

    const { result, act } = await renderHookWrapper(useRemoveLiquidity, args)

    const successCb = jest.fn()
    await act(async () => {
      await result.handleWithdraw(successCb, true)
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
    mockHooksOrMethods.useTxPoster()
  })
})
