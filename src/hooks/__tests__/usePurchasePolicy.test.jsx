import { usePurchasePolicy } from '@/src/hooks/usePurchasePolicy'
import { convertToUnits } from '@/utils/bn'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

const mockArgs = {
  coverKey:
    '0x6262382d65786368616e67650000000000000000000000000000000000000000',
  productKey:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  value: '100',
  feeAmount: '9698630',
  coverMonth: '2',
  availableLiquidity: '3791617.978',
  liquidityTokenSymbol: 'DAI',
  referralCode: ''
}

describe('usePurchasePolicy', () => {
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.usePolicyAddress()
  mockHooksOrMethods.useAppConstants()
  mockHooksOrMethods.useERC20Balance()
  mockHooksOrMethods.useERC20Allowance()
  mockHooksOrMethods.useRouter()
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockHooksOrMethods.useLiquidityFormsContext()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useErrorNotifier()
  mockSdk.registry.PolicyContract.getInstance()

  test('should return default value from hook', async () => {
    const { result } = await renderHookWrapper(usePurchasePolicy, [mockArgs])

    expect(result.balance.toString()).toEqual(
      testData.erc20Balance.balance.toString()
    )
  })

  test('calling handleApprove function', async () => {
    mockHooksOrMethods.useERC20Allowance(() => ({
      ...testData.erc20Allowance,
      allowance: convertToUnits(mockArgs.value)
    }))

    const { result, act } = await renderHookWrapper(usePurchasePolicy, [
      mockArgs
    ])

    await act(async () => {
      await result.handleApprove()
    })

    await (await testData.txPoster.contractRead()).toString()
    expect(result.allowance).toEqual(convertToUnits(mockArgs.value))
    expect(result.canPurchase).toBe(true)
  })

  test('calling handlePurchase function', async () => {
    mockHooksOrMethods.useTxToast()
    const { result, act } = await renderHookWrapper(usePurchasePolicy, [
      mockArgs
    ])

    await act(async () => {
      await result.handlePurchase(jest.fn())
    })
  })

  test('calling handlePurchase function with error', async () => {
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined
    }))
    const { result, act } = await renderHookWrapper(usePurchasePolicy, [
      mockArgs
    ])

    await act(async () => {
      await result.handlePurchase(jest.fn())
    })
  })

  test('simulating for coverage', async () => {
    mockGlobals.console.error().mock()
    let args = { ...mockArgs, value: 'invalid' }
    const { result, rerender } = await renderHookWrapper(
      usePurchasePolicy,
      [args],
      true
    )
    expect(result.error).toBe('Invalid amount to cover')

    args = { ...mockArgs, value: '' }
    await rerender([args])

    args = { ...mockArgs, value: '1001' }
    await rerender([args])

    args = { ...mockArgs, value: '0' }
    await rerender([args])

    args = { ...mockArgs, value: '3791620' }
    await rerender([args])

    args = { ...mockArgs, feeAmount: convertToUnits(1100) }
    await rerender([args])

    mockHooksOrMethods.useNetwork()

    await rerender([args])

    mockGlobals.console.error().restore()
  })
})
