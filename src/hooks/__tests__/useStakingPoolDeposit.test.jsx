import { useStakingPoolDeposit } from '@/src/hooks/useStakingPoolDeposit'
import {
  convertToUnits,
  sumOf,
  toBN
} from '@/utils/bn'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useStakingPoolDeposit', () => {
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useStakingPoolsAddress()
  mockHooksOrMethods.useERC20Allowance()
  mockHooksOrMethods.useERC20Balance()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useErrorNotifier()
  mockHooksOrMethods.useRouter()
  mockSdk.registry.StakingPools.getInstance()

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
    mockHooksOrMethods.useTxToast(() => {
      return {
        ...testData.txToast,
        push: mockPushFn
      }
    })

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleApprove()
    })
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockHooksOrMethods.useTxToast()
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
    mockHooksOrMethods.useTxToast(() => {
      return {
        ...testData.txToast,
        push: mockPushFn
      }
    })

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleDeposit()
    })
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockHooksOrMethods.useTxToast()
  })

  test('should handle error for writeContract function in handleDeposit', async () => {
    mockHooksOrMethods.useTxPoster(() => {
      return {
        ...testData.txPoster,
        writeContract: null
      }
    })

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleDeposit()
    })
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockHooksOrMethods.useTxPoster()
  })

  test('should return if no networkId or account during handleDeposit', async () => {
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })

    const { result, act } = await renderHookWrapper(
      useStakingPoolDeposit,
      args
    )
    await act(async () => {
      await result.handleDeposit()
    })

    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
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
      mockHooksOrMethods.useERC20Balance(() => {
        return {
          ...testData.erc20Balance,
          balance: convertToUnits(1000000000)
        }
      })

      const value = toBN(100000000)
      const { result } = await renderHookWrapper(
        useStakingPoolDeposit,
        [{ ...args[0], value: value }],
        true
      )

      expect(result.errorMsg).toEqual('Cannot stake more than 10,000')

      mockHooksOrMethods.useERC20Balance()
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
