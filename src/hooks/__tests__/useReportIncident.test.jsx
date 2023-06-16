import { useReportIncident } from '@/src/hooks/useReportIncident'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useReportIncident', () => {
  mockHooksOrMethods.useRouter()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useGovernanceAddress()
  mockHooksOrMethods.useAppConstants()
  mockHooksOrMethods.useERC20Allowance()
  mockHooksOrMethods.useERC20Balance()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useErrorNotifier()
  mockSdk.governance.report()

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
    mockHooksOrMethods.useRouter()
    mockHooksOrMethods.ipfs.writeToIpfs()

    const { result, act } = await renderHookWrapper(useReportIncident, args)

    await act(async () => {
      const payload = { id: 123, observed: new Date() }
      await result.handleReport(payload)
    })
    expect(testData.router.replace).toHaveBeenCalled()
  })

  test('should call notifyError in handleApprove function if error raised', async () => {
    mockHooksOrMethods.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject(new Error('Something went wrong')))
    }))

    const { result, act } = await renderHookWrapper(useReportIncident, args)

    await act(async () => {
      await result.handleApprove()
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
    mockHooksOrMethods.useTxToast()
  })

  test('should call notifyError in handleReport function if error raised', async () => {
    mockHooksOrMethods.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject(new Error('Something went wrong')))
    }))

    const { result, act } = await renderHookWrapper(useReportIncident, [
      {
        ...args[0],
        value: ''
      }
    ])

    await act(async () => {
      const payload = { id: 123, observed: new Date() }
      await result.handleReport(payload)
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
    mockHooksOrMethods.useTxToast()
  })
})
