import {
  useStakingPoolWithdraw,
  useStakingPoolWithdrawRewards
} from '@/src/hooks/useStakingPoolWithdraw'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useStakingPoolWithdraw', () => {
  mockFn.useNetwork()
  mockFn.useWeb3React()
  mockFn.useTxToast()
  mockFn.useTxPoster()
  mockFn.useErrorNotifier()
  mockFn.sdk.registry.StakingPools.getInstance()

  const args = [
    {
      value: '1000',
      poolKey:
        '0x4245430000000000000000000000000000000000000000000000000000000000',
      refetchInfo: jest.fn(),
      tokenSymbol: 'NPM'
    }
  ]

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useStakingPoolWithdraw, args)

    expect(result.withdrawing).toEqual(false)
    expect(typeof result.handleWithdraw).toEqual('function')
  })

  test('should be able to execute handleWithdraw function', async () => {
    const { result, act } = await renderHookWrapper(
      useStakingPoolWithdraw,
      args
    )

    await act(async () => {
      const onTxSuccess = jest.fn()
      await result.handleWithdraw(onTxSuccess)
    })

    expect(testData.txPoster.writeContract).toHaveBeenCalled()
  })

  test('should handle error if error occured in handleWithdraw function', async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null
    }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolWithdraw,
      args
    )

    await act(async () => {
      const onTxSuccess = jest.fn()
      await result.handleWithdraw(onTxSuccess)
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockFn.useTxPoster()
  })

  test('should return if no networkId or account in handleWithdraw function', async () => {
    mockFn.useNetwork(() => ({ networkId: null }))
    mockFn.useWeb3React(() => ({ account: null }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolWithdraw,
      args
    )

    await act(async () => {
      const onTxSuccess = jest.fn()
      await result.handleWithdraw(onTxSuccess)

      expect(onTxSuccess).not.toHaveBeenCalled()
    })

    mockFn.useNetwork()
    mockFn.useWeb3React()
  })
})

describe('useStakingPoolWithdrawRewards', () => {
  mockFn.useNetwork()
  mockFn.useWeb3React()
  mockFn.useTxToast()
  mockFn.useTxPoster()
  mockFn.useErrorNotifier()
  mockFn.sdk.registry.StakingPools.getInstance()

  const args = [
    {
      poolKey:
        '0x4245430000000000000000000000000000000000000000000000000000000000',
      refetchInfo: jest.fn()
    }
  ]

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(
      useStakingPoolWithdrawRewards,
      args
    )

    expect(result.withdrawingRewards).toEqual(false)
    expect(typeof result.handleWithdrawRewards).toEqual('function')
  })

  test('should be able to execute handleWithdrawRewards function', async () => {
    const { result, act } = await renderHookWrapper(
      useStakingPoolWithdrawRewards,
      args
    )

    await act(async () => {
      const onTxSuccess = jest.fn()
      await result.handleWithdrawRewards(onTxSuccess)
    })

    expect(testData.txPoster.writeContract).toHaveBeenCalled()
  })

  test('should handle error if error occured in handleWithdrawRewards function', async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null
    }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolWithdrawRewards,
      args
    )

    await act(async () => {
      const onTxSuccess = jest.fn()
      await result.handleWithdrawRewards(onTxSuccess)
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockFn.useTxPoster()
  })

  test('should return if no networkId or account in handleWithdrawRewards function', async () => {
    mockFn.useNetwork(() => ({ networkId: null }))
    mockFn.useWeb3React(() => ({ account: null }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolWithdrawRewards,
      args
    )

    await act(async () => {
      const onTxSuccess = jest.fn()
      await result.handleWithdrawRewards(onTxSuccess)

      expect(onTxSuccess).not.toHaveBeenCalled()
    })

    mockFn.useNetwork()
    mockFn.useWeb3React()
  })
})
