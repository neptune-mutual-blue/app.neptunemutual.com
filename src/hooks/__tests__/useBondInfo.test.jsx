import { useBondInfo } from '../useBondInfo'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'

const mockData = {
  data: testData.bondInfo.data
}

describe('useBondInfo', () => {
  describe('wallet is not connected', () => {
    mockFn.utilsWeb3.getProviderOrSigner()
    mockFn.sdk.registry.BondPool.getInstance()
    mockFn.useErrorNotifier()
    mockFn.useTxPoster()
    mockFn.useWeb3React(() => ({ account: null }))

    test('while fetching w/o account and networkId', async () => {
      mockFn.useNetwork(() => ({ networkId: null }))

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
      mockFn.useNetwork()
      mockFn.getReplacedString()
      mockFn.fetch(true, undefined, mockData)

      const { result } = await renderHookWrapper(useBondInfo, [], true)
      const { lpToken, ...rest } = mockData.data

      expect(result.info).toEqual({
        lpTokenAddress: lpToken,
        ...rest
      })
    })
  })

  describe('wallet is connected', () => {
    mockFn.utilsWeb3.getProviderOrSigner()
    mockFn.sdk.registry.BondPool.getInstance()
    mockFn.getBondInfo(mockData.data)

    test('while fetching w/o networkId', async () => {
      mockFn.useWeb3React()
      mockFn.useNetwork(() => ({ networkId: null }))

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
      mockFn.useWeb3React()
      mockFn.useNetwork()

      const { result } = await renderHookWrapper(useBondInfo, [], true)

      const { lpToken, ...rest } = mockData.data

      expect(result.info).toEqual({
        lpTokenAddress: lpToken,
        ...rest
      })
    })

    test('calling refetch function', async () => {
      mockFn.useWeb3React()
      mockFn.useNetwork()

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
