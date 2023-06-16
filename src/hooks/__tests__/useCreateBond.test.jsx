import { useCreateBond } from '@/src/hooks/useCreateBond'
import { convertToUnits } from '@/utils/bn'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useCreateBond', () => {
  mockHooksOrMethods.useDebounce()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useRouter()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useAppConstants()
  mockHooksOrMethods.useBondPoolAddress()
  mockHooksOrMethods.useERC20Allowance()
  mockHooksOrMethods.useERC20Balance()
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useErrorNotifier()
  mockSdk.registry.BondPool.getInstance()

  test('should return default value from hook', async () => {
    const { result } = await renderHookWrapper(useCreateBond, [
      testData.useCreateBondArgs
    ])

    expect(result.balance.toString()).toEqual(
      testData.erc20Balance.balance.toString()
    )
    expect(result.loadingBalance).toBe(false)
    expect(result.loadingAllowance).toBe(false)

    expect(result.receiveAmount).toEqual('0')
    expect(result.receiveAmountLoading).toBe(false)
    expect(result.approving).toBe(false)

    expect(result.bonding).toBe(false)
    expect(result.canBond).toBe(false)
    expect(result.error).toBe('')
  })

  test('calling handleApprove function', async () => {
    mockHooksOrMethods.useERC20Allowance(() => {
      return {
        ...testData.erc20Allowance,
        allowance: convertToUnits(testData.useCreateBondArgs.value)
      }
    })

    const { result, act } = await renderHookWrapper(
      useCreateBond,
      [testData.useCreateBondArgs],
      true
    )

    await act(async () => {
      await result.handleApprove()
    })

    expect(testData.erc20Allowance.approve).toHaveBeenCalled()
    expect(result.canBond).toEqual(true)
  })

  test('calling handleApprove function with error', async () => {
    mockHooksOrMethods.useTxToast(() => {
      return {
        ...testData.txToast,
        push: jest.fn(() => { return Promise.reject(new Error('Error occurred when calling approve function')) })
      }
    })

    const { result, act } = await renderHookWrapper(
      useCreateBond,
      [testData.useCreateBondArgs],
      true
    )

    await act(async () => {
      await result.handleApprove()
    })
  })

  test('calling handleBond function', async () => {
    mockHooksOrMethods.useTxToast()
    const { result, act } = await renderHookWrapper(
      useCreateBond,
      [testData.useCreateBondArgs],
      true
    )

    await act(async () => {
      await result.handleBond(jest.fn())
    })
  })

  test('calling handleBond function with error', async () => {
    mockHooksOrMethods.useTxPoster(() => {
      return {
        ...testData.txPoster,
        writeContract: undefined
      }
    })
    const { result, act } = await renderHookWrapper(
      useCreateBond,
      [testData.useCreateBondArgs],
      true
    )

    await act(async () => {
      await result.handleBond(jest.fn())
    })
  })

  test('rendering with error for useeffects', async () => {
    mockHooksOrMethods.useNetwork(() => {
      return {
        networkId: null
      }
    })
    const { result } = await renderHookWrapper(
      useCreateBond,
      [testData.useCreateBondArgs],
      false
    )

    expect(result.receiveAmount).toEqual('0')
    // mockHooksOrMethods.useTxPoster(() => ({
    //   ...testData.txPoster,
    //   contractRead: jest.fn(() => Promise.reject({ data: "MOCK error" })),
    // }));

    // rerender();
  })

  test('simulating for coverage', async () => {
    mockGlobals.console.error().mock()
    let args = { ...testData.useCreateBondArgs, value: 'invalid' }
    const { result, rerender } = await renderHookWrapper(
      useCreateBond,
      [args],
      true
    )
    expect(result.error).toBe('Invalid amount to bond')

    args = { ...testData.useCreateBondArgs, value: '' }
    await rerender([args])

    args = { ...testData.useCreateBondArgs, value: '1001' }
    await rerender([args])

    args = { ...testData.useCreateBondArgs, value: '0' }
    await rerender([args])

    mockHooksOrMethods.useNetwork()
    args = {
      ...testData.useCreateBondArgs,
      info: { ...testData.useCreateBondArgs.info, maxBond: '0' }
    }
    await rerender([args])

    mockGlobals.console.error().restore()
  })
})
