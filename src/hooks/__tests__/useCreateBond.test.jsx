import { useCreateBond } from '@/src/hooks/useCreateBond'
import { convertToUnits } from '@/utils/bn'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useCreateBond', () => {
  mockFn.useDebounce()
  mockFn.useNetwork()
  mockFn.useRouter()
  mockFn.useWeb3React()
  mockFn.useAppConstants()
  mockFn.useBondPoolAddress()
  mockFn.useERC20Allowance()
  mockFn.useERC20Balance()
  mockFn.utilsWeb3.getProviderOrSigner()
  mockFn.useTxToast()
  mockFn.useTxPoster()
  mockFn.useErrorNotifier()
  mockFn.sdk.registry.BondPool.getInstance()

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
    mockFn.useERC20Allowance(() => ({
      ...testData.erc20Allowance,
      allowance: convertToUnits(testData.useCreateBondArgs.value)
    }))

    const { result, act } = await renderHookWrapper(
      useCreateBond,
      [testData.useCreateBondArgs],
      true
    )

    await act(async () => {
      await result.handleApprove()
    })

    const amount = await (await testData.txPoster.contractRead()).toString()
    expect(result.receiveAmount).toEqual(amount)
    expect(result.canBond).toEqual(true)
  })

  test('calling handleApprove function with error', async () => {
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject(new Error('Error occurred when calling approve function')))
    }))

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
    mockFn.useTxToast()
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
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined
    }))
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
    mockFn.useNetwork(() => ({
      networkId: null
    }))
    const { result } = await renderHookWrapper(
      useCreateBond,
      [testData.useCreateBondArgs],
      false
    )

    expect(result.receiveAmount).toEqual('0')
    // mockFn.useTxPoster(() => ({
    //   ...testData.txPoster,
    //   contractRead: jest.fn(() => Promise.reject({ data: "MOCK error" })),
    // }));

    // rerender();
  })

  test('simulating for coverage', async () => {
    mockFn.console.error().mock()
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

    mockFn.useNetwork()
    args = {
      ...testData.useCreateBondArgs,
      info: { ...testData.useCreateBondArgs.info, maxBond: '0' }
    }
    await rerender([args])

    mockFn.console.error().restore()
  })
})
