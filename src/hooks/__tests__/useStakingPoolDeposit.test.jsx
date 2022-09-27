import { useStakingPoolDeposit } from '@/src/hooks/useStakingPoolDeposit'
import { convertToUnits, sumOf, toBN } from '@/utils/bn'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useStakingPoolDeposit', () => {
  mockFn.useNetwork()
  mockFn.useWeb3React()
  mockFn.useStakingPoolsAddress()
  mockFn.useERC20Allowance()
  mockFn.useERC20Balance()
  mockFn.useTxToast()
  mockFn.useTxPoster()
  mockFn.useErrorNotifier()
  mockFn.useRouter()
  mockFn.sdk.registry.StakingPools.getInstance()

  const args = [
    {
      value: '1000',
      poolKey:
        '0x4372706f6f6c0000000000000000000000000000000000000000000000000000',
      refetchInfo: jest.fn(),
      tokenAddress: '0xF7c352D9d6967Bd916025030E38eA58cF48029f8',
      tokenSymbol: 'NPM',
      maximumStake: '10000000000000000000000'
    }
  ]

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useStakingPoolDeposit, args)

    expect(result.balance.toString()).toEqual(
      testData.erc20Balance.balance.toString()
    )
    expect(result.maxStakableAmount.toString()).toEqual(
      '1000000000000000000000'
    )
    expect(result.isError).toEqual('')
    expect(result.errorMsg).toEqual('')
    expect(result.loadingBalance).toBe(false)
    expect(result.approving).toBe(false)
    expect(result.loadingAllowance).toBe(false)
    expect(result.depositing).toBe(false)
    expect(result.canDeposit).toBe(false)
    expect(typeof result.handleApprove).toEqual('function')
    expect(typeof result.handleDeposit).toEqual('function')
  })

  test('should be able to execute handleApprove function', async () => {
    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )

    await act(async () => {
      await result.handleApprove()
    })

    expect(testData.erc20Allowance.approve).toHaveBeenCalled()
  })

  test('should handle error in onTransactionResult function while approving', async () => {
    const mockPushFn = jest.fn().mockRejectedValue('Error')
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: mockPushFn
    }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleApprove()
    })
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockFn.useTxToast()
  })

  test('should be able to execute handleDeposit function', async () => {
    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )

    await act(async () => {
      const onDepositSuccess = jest.fn()
      await result.handleDeposit(onDepositSuccess)
    })

    expect(testData.txPoster.writeContract).toHaveBeenCalled()
  })

  test('should handle error in onTransactionResult function in handleDeposit', async () => {
    const mockPushFn = jest.fn().mockRejectedValue('Error')
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: mockPushFn
    }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleDeposit()
    })
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockFn.useTxToast()
  })

  test('should handle error for writeContract function in handleDeposit', async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null
    }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleDeposit()
    })
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockFn.useTxPoster()
  })

  test('should return if no networkId or account during handleDeposit', async () => {
    mockFn.useNetwork(() => ({ networkId: null }))
    mockFn.useWeb3React(() => ({ account: null }))

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleDeposit()
    })

    mockFn.useNetwork()
    mockFn.useWeb3React()
  })

  describe('Edge cases covergae', () => {
    test('if no value but error is present', async () => {
      const { rerender, renderHookResult } = await renderHookWrapper(
        useStakingPoolDeposit,
        [{ ...args[0], value: 'invalid_number' }],
        true
      )
      expect(renderHookResult.current.errorMsg).toEqual(
        'Invalid amount to stake'
      )
      await rerender([{ ...args[0], value: '' }])

      expect(renderHookResult.current.errorMsg).toEqual('')
    })

    test('if value is 0', async () => {
      const { result } = await renderHookWrapper(
        useStakingPoolDeposit,
        [{ ...args[0], value: '0' }],
        true
      )

      expect(result.errorMsg).toEqual('Please specify an amount')
    })

    test('if value is greater than balance', async () => {
      const value = sumOf(testData.erc20Balance.balance, '100')
      const { result } = await renderHookWrapper(
        useStakingPoolDeposit,
        [{ ...args[0], value: value }],
        true
      )
      expect(result.errorMsg).toEqual('Insufficient Balance')
    })

    test('if value is greater than maxStakableAmount', async () => {
      mockFn.useERC20Balance(() => ({
        ...testData.erc20Balance,
        balance: convertToUnits(1000000000)
      }))

      const value = toBN(100000000)
      const { result } = await renderHookWrapper(
        useStakingPoolDeposit,
        [{ ...args[0], value: value }],
        true
      )

      expect(result.errorMsg).toEqual('Cannot stake more than 10,000')

      mockFn.useERC20Balance()
    })

    test('if error when rerendering', async () => {
      const { renderHookResult, rerender, act } = await renderHookWrapper(
        useStakingPoolDeposit,
        [{ ...args[0], value: 'invalid_value' }],
        true
      )

      expect(renderHookResult.current.errorMsg).toEqual(
        'Invalid amount to stake'
      )
      await act(async () => {
        await rerender(args)
      })

      expect(renderHookResult.current.errorMsg).toEqual('')
    })
  })
})
