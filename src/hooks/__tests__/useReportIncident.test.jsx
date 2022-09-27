import { useReportIncident } from '@/src/hooks/useReportIncident'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useReportIncident', () => {
  mockFn.useRouter()
  mockFn.useWeb3React()
  mockFn.useNetwork()
  mockFn.useGovernanceAddress()
  mockFn.useAppConstants()
  mockFn.useERC20Allowance()
  mockFn.useERC20Balance()
  mockFn.useTxToast()
  mockFn.useErrorNotifier()
  mockFn.sdk.governance.report()

  const args = [
    {
      coverKey:
        '0x7072696d65000000000000000000000000000000000000000000000000000000',
      productKey:
        '0x62616c616e636572000000000000000000000000000000000000000000000000',
      value: '10000'
    }
  ]

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useReportIncident, args)

    expect(result.tokenAddress).toEqual(testData.appConstants.NPMTokenAddress)
    expect(result.tokenSymbol).toEqual(testData.appConstants.NPMTokenSymbol)
    expect(result.balance).toEqual(testData.erc20Balance.balance)
    expect(result.loadingBalance).toEqual(false)
    expect(result.approving).toEqual(false)
    expect(result.loadingAllowance).toEqual(false)
    expect(result.reporting).toEqual(false)
    expect(result.canReport).toEqual(false)
    expect(result.isError).toEqual(true)
    expect(typeof result.handleApprove).toEqual('function')
    expect(typeof result.handleReport).toEqual('function')
  })

  test('should be able to execute handleApprove function', async () => {
    const { result, act } = await renderHookWrapper(useReportIncident, args)

    await act(async () => {
      await result.handleApprove()
    })
  })

  test('should be able to execute handleReport function', async () => {
    const { result, act } = await renderHookWrapper(useReportIncident, args)

    await act(async () => {
      const payload = { id: 123 }
      await result.handleReport(payload)
    })
    expect(testData.router.replace).toHaveBeenCalled()
  })

  test('should call notifyError in handleApprove function if error raised', async () => {
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject('Err'))
    }))

    const { result, act } = await renderHookWrapper(useReportIncident, args)

    await act(async () => {
      await result.handleApprove()
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
    mockFn.useTxToast()
  })

  test('should call notifyError in handleReport function if error raised', async () => {
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject('Err'))
    }))

    const { result, act } = await renderHookWrapper(useReportIncident, [
      {
        ...args[0],
        value: ''
      }
    ])

    await act(async () => {
      const payload = { id: 123 }
      await result.handleReport(payload)
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
    mockFn.useTxToast()
  })
})
