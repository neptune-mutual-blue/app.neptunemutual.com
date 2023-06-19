import { defaultInfo, usePoolInfo } from '@/src/hooks/usePoolInfo'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('usePoolInfo', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useErrorNotifier()

  const args = [{ key: 12345, type: 'pod' }]

  test('should return default hook result', async () => {
    mockGlobals.fetch()

    const { result } = await renderHookWrapper(usePoolInfo, args)
    expect(result.info).toEqual(defaultInfo)
    expect(typeof result.refetch).toEqual('function')

    mockGlobals.fetch().unmock()
  })

  test('should return data as retured from api', async () => {
    const mockData = {
      data: {
        ...defaultInfo,
        name: 'test',
        rewardToken: 1093,
        rewardPerBlock: 10,
        canWithdrawFromBlockHeight: true,
        lastDepositHeight: '857',
        lastRewardHeight: '9855'
      }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(usePoolInfo, args, true)
    expect(result.info).toEqual(mockData.data)

    mockGlobals.fetch().unmock()
  })

  test('should run notifyError function if error arises', async () => {
    mockGlobals.fetch(false)

    await renderHookWrapper(usePoolInfo, args)
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
  })

  test('should return default value if no network', async () => {
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })

    const { result } = await renderHookWrapper(usePoolInfo, args)
    expect(result.info).toEqual(defaultInfo)

    mockHooksOrMethods.useNetwork()
  })

  test('should be able to execute the refetch function', async () => {
    mockGlobals.fetch()

    const { result, renderHookResult, act } = await renderHookWrapper(
      usePoolInfo,
      args
    )
    await act(async () => {
      await result.refetch()
    })
    expect(renderHookResult.current.info).toEqual(defaultInfo)

    mockGlobals.fetch().unmock()
  })

  test('should get correct result from refetch function', async () => {
    const mockData = {
      data: {
        ...defaultInfo,
        name: 'mock-test',
        lastDepositHeight: '857',
        lastRewardHeight: '9855'
      }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result, renderHookResult, act } = await renderHookWrapper(
      usePoolInfo,
      [{ key: 12345 }],
      true
    )
    await act(async () => {
      await result.refetch()
    })
    expect(renderHookResult.current.info).toEqual(mockData.data)

    mockGlobals.fetch().unmock()
  })

  test('should log error if error arises in fetchPoolInfo', async () => {
    mockGlobals.fetch(false)
    mockHooksOrMethods.useErrorNotifier(() => { return { notifyError: null } })
    mock()

    await renderHookWrapper(usePoolInfo, args)
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    mockHooksOrMethods.useErrorNotifier()
    restore()
  })
})
