import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

import { useBondInfo } from '../useBondInfo'

const mockData = {
  data: testData.bondInfo.data
}

jest.mock('@neptunemutual/sdk')

describe('useBondInfo', () => {
  describe('wallet is not connected', () => {
    mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
    mockSdk.registry.BondPool.getInstance()
    mockHooksOrMethods.useErrorNotifier()
    mockHooksOrMethods.useTxPoster()
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))

    test('while fetching w/o account and networkId', async () => {
      mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

      const { result } = await renderHookWrapper(useBondInfo)

      expect(result.info).toEqual({
        lpTokenAddress: '',
        discountRate: '0',
        vestingTerm: '0',
        maxBond: '0',
        totalNpmAllocated: '0',
        totalNpmDistributed: '0',
        bondContribution: '0',
        claimable: '0',
        unlockDate: '0'
      })
      expect(result.refetch).toEqual(expect.any(Function))
    })

    test('while fetching w/o account but w/ networkId', async () => {
      mockHooksOrMethods.useNetwork()
      mockHooksOrMethods.getReplacedString()
      mockGlobals.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(useBondInfo, [], true)
      const { lpToken, ...rest } = mockData.data

      expect(result.info).toEqual({
        lpTokenAddress: lpToken,
        ...rest
      })
    })
  })

  describe('wallet is connected', () => {
    mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
    mockSdk.registry.BondPool.getInstance()

    test('while fetching w/o networkId', async () => {
      mockHooksOrMethods.useWeb3React()
      mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

      const { result } = await renderHookWrapper(useBondInfo)

      expect(result.info).toEqual({
        lpTokenAddress: '',
        discountRate: '0',
        vestingTerm: '0',
        maxBond: '0',
        totalNpmAllocated: '0',
        totalNpmDistributed: '0',
        bondContribution: '0',
        claimable: '0',
        unlockDate: '0'
      })
      expect(result.refetch).toEqual(expect.any(Function))
    })

    test('while fetching w/ networkId', async () => {
      mockHooksOrMethods.useWeb3React()
      mockHooksOrMethods.useNetwork()

      const { result } = await renderHookWrapper(useBondInfo, [], true)

      const { lpToken, ...rest } = mockData.data

      expect(result.info).toEqual({
        lpTokenAddress: lpToken,
        ...rest
      })
    })

    test('calling refetch function', async () => {
      mockHooksOrMethods.useWeb3React()
      mockHooksOrMethods.useNetwork()

      const { result, act } = await renderHookWrapper(useBondInfo, [], true)

      await act(async () => {
        await result.refetch()
      })

      const { lpToken, ...rest } = mockData.data

      expect(result.info).toEqual({
        lpTokenAddress: lpToken,
        ...rest
      })
    })
  })
})
