import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { useConsensusReportingInfo } from '../useConsensusReportingInfo'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

const mockProps = {
  coverKey:
    '0x7072696d65000000000000000000000000000000000000000000000000000000',
  productKey:
    '0x62616c616e636572000000000000000000000000000000000000000000000000',
  incidentDate: ''
}

const mockData = {
  info: {
    yes: '0',
    no: '0',
    myYes: '0',
    myNo: '0',
    totalStakeInWinningCamp: '0',
    totalStakeInLosingCamp: '0',
    myStakeInWinningCamp: '0',
    unstaken: '0',
    latestIncidentDate: '0',
    burnRate: '0',
    reporterCommission: '0',
    allocatedReward: '0',
    toBurn: '0',
    toReporter: '0',
    myReward: '0',
    willReceive: '0'
  }
}

describe('useConsensusReportingInfo', () => {
  const { mock, restore } = mockGlobals.console.error()

  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()

  test('while fetching w/o networkId and coverKey', async () => {
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })

    const { result } = await renderHookWrapper(useConsensusReportingInfo, [
      {
        coverKey: '',
        productKey: mockProps.productKey,
        incidentDate: mockProps.incidentDate
      }
    ])

    expect(result.info).toEqual(mockData.info)
    expect(result.refetch).toEqual(expect.any(Function))
  })

  test('while fetching w/ networkId, coverKey and account', async () => {
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.getUnstakeInfoFor()

    const { result } = await renderHookWrapper(useConsensusReportingInfo, [
      [mockProps],
      true
    ])

    expect(result.info).toEqual(mockData.info)
  })

  test('while fetching w/ networkId, coverKey and w/o account', async () => {
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })
    mockHooksOrMethods.getReplacedString()
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useConsensusReportingInfo, [
      [mockProps],
      true
    ])

    expect(result.info).toEqual(mockData.info)
  })

  test('calling refetch function', async () => {
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.getReplacedString()
    mockGlobals.fetch(true, undefined, mockData)

    const { result, act } = await renderHookWrapper(
      useConsensusReportingInfo,
      [mockProps],
      true
    )

    await act(async () => {
      await result.refetch()
    })

    expect(result.info).toEqual(mockData.info)
  })

  test('while fetching error', async () => {
    mockGlobals.fetch(false)
    mock()

    const { result } = await renderHookWrapper(
      useConsensusReportingInfo,
      [mockProps],
      true
    )

    expect(result.info).toEqual(mockData.info)

    mockGlobals.fetch().unmock()
    restore()
  })
})
