import {
  defaultInfo,
  usePolicyFees
} from '@/src/hooks/usePolicyFees'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

function assertData (result, defaultData = false) {
  if (defaultData) {
    expect(result.data).toEqual(defaultInfo)
  } else {
    const { getCoverFeeInfoResult, getExpiryDateResult } =
      testData.multicallProvider

    expect(result.data.fee).toEqual(getCoverFeeInfoResult.fee)
    expect(result.data.utilizationRatio).toEqual(
      getCoverFeeInfoResult.utilizationRatio
    )
    expect(result.data.totalAvailableLiquidity).toEqual(
      getCoverFeeInfoResult.totalAvailableLiquidity
    )
    expect(result.data.floor).toEqual(getCoverFeeInfoResult.floor)
    expect(result.data.ceiling).toEqual(getCoverFeeInfoResult.ceiling)
    expect(result.data.rate).toEqual(getCoverFeeInfoResult.rate)
    expect(result.data.expiryDate).toEqual(getExpiryDateResult)
  }
}

describe('usePolicyFees', () => {
  mockSdk.multicall()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useDebounce()
  mockHooksOrMethods.useErrorNotifier()
  mockSdk.registry.PolicyContract.getAddress()

  const args = [
    {
      value: '100',
      coverMonth: '2',
      coverKey:
        '0x6262382d65786368616e67650000000000000000000000000000000000000000',
      productKey:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      liquidityTokenDecimals: 6
    }
  ]

  test('should return correct data', async () => {
    const { result } = await renderHookWrapper(usePolicyFees, args, true)

    expect(result.loading).toEqual(false)
    assertData(result)
  })

  test('should return correct data if no productKey', async () => {
    const { result } = await renderHookWrapper(
      usePolicyFees,
      [{ ...args[0], productKey: '' }],
      true
    )

    expect(result.loading).toEqual(false)
    assertData(result)
  })

  test('should return default info if no networkId', async () => {
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(usePolicyFees, args)
    assertData(result, true)

    mockHooksOrMethods.useNetwork()
  })

  test('should call notifyError if error is raised', async () => {
    mockSdk.registry.PolicyContract.getAddress(false, true)

    await renderHookWrapper(usePolicyFees, args)
    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
  })
})
