import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'
import { useProvideLiquidity } from '@/src/hooks/useProvideLiquidity'
import { convertToUnits } from '@/utils/bn'

const mockArgs = {
  coverKey:
    '0x616e696d617465642d6272616e64730000000000000000000000000000000000',
  lqValue: '100',
  npmValue: '250',
  liquidityTokenDecimals: '6',
  npmTokenDecimals: '18'
}

describe('useProvideLiquidity', () => {
  mockFn.useNetwork()
  mockFn.useWeb3React()
  mockFn.useAppConstants()
  mockFn.useERC20Allowance()
  mockFn.utilsWeb3.getProviderOrSigner()
  mockFn.useLiquidityFormsContext()
  mockFn.useTxToast()
  mockFn.useTxPoster()
  mockFn.useErrorNotifier()
  mockFn.sdk.registry.Vault.getInstance()

  test('should return default value from hook', async () => {
    const { result } = await renderHookWrapper(useProvideLiquidity, [mockArgs])

    expect(result.npmBalance.toString()).toEqual(
      testData.liquidityFormsContext.stakingTokenBalance.toString()
    )
  })

  test('calling handleLqTokenApprove function', async () => {
    mockFn.useERC20Allowance(() => ({
      ...testData.erc20Allowance,
      allowance: convertToUnits(mockArgs.lqValue)
    }))

    const { result, act } = await renderHookWrapper(useProvideLiquidity, [
      mockArgs
    ])

    await act(async () => {
      await result.handleLqTokenApprove()
    })

    await (await testData.txPoster.contractRead()).toString()
    expect(result.hasLqTokenAllowance).toEqual(true)
  })

  test('calling handleLqTokenApprove function with error', async () => {
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject(new Error('Something went wrong')))
    }))

    const { result, act } = await renderHookWrapper(useProvideLiquidity, [
      mockArgs
    ])

    await act(async () => {
      await result.handleLqTokenApprove()
    })
  })

  test('calling handleNPMTokenApprove function', async () => {
    mockFn.useERC20Allowance(() => ({
      ...testData.erc20Allowance,
      allowance: convertToUnits(mockArgs.npmValue)
    }))

    const { result, act } = await renderHookWrapper(useProvideLiquidity, [
      mockArgs
    ])

    await act(async () => {
      await result.handleNPMTokenApprove()
    })

    await (await testData.txPoster.contractRead()).toString()
    expect(result.hasNPMTokenAllowance).toEqual(true)
  })

  test('calling handleNPMTokenApprove function with error', async () => {
    mockFn.useTxToast(() => ({
      ...testData.txToast,
      push: jest.fn(() => Promise.reject(new Error('Something went wrong')))
    }))

    const { result, act } = await renderHookWrapper(useProvideLiquidity, [
      mockArgs
    ])

    await act(async () => {
      await result.handleNPMTokenApprove()
    })
  })

  test('calling handleProvide function', async () => {
    mockFn.useTxToast()
    const { result, act } = await renderHookWrapper(useProvideLiquidity, [
      mockArgs
    ])

    await act(async () => {
      await result.handleProvide(jest.fn())
    })
  })

  test('calling handleProvide function with error', async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: undefined
    }))
    const { result, act } = await renderHookWrapper(useProvideLiquidity, [
      mockArgs
    ])

    await act(async () => {
      await result.handleProvide(jest.fn())
    })
  })
})
