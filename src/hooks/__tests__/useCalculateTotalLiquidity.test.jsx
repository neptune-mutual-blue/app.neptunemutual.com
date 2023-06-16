import {
  useCalculateTotalLiquidity
} from '@/src/hooks/useCalculateTotalLiquidity'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'

jest.mock('@neptunemutual/sdk')

describe('useCalculateTotalLiquidity', () => {
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()

  const mockMulticallResult = ['500002829', '2222001389']
  mockSdk.multicall({ all: () => { return Promise.resolve(mockMulticallResult) } })

  const args = [
    {
      liquidityList: [
        {
          podAmount: '500000000000000000000',
          podAddress: '0x98e7786fff366aeff1a55131c92c4aa7edd68ad1'
        },
        {
          podAmount: '2221998491918503536107',
          podAddress: '0x99d0c1e1cd16916826d1de330c587db95ff5b000'
        }
      ]
    }
  ]

  test('should return correct data', async () => {
    const { result } = await renderHookWrapper(
      useCalculateTotalLiquidity,
      args,
      true
    )

    const expected = mockMulticallResult.reduce((p, c) => { return p + parseInt(c) }, 0)
    expect(result).toEqual(expected.toString())
  })

  test('should return value as 0 if liquidityList is empty', async () => {
    const { result } = await renderHookWrapper(useCalculateTotalLiquidity, [
      {}
    ])

    expect(result).toEqual('0')
  })
})
