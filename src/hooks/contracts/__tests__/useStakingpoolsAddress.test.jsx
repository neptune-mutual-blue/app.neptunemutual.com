import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'
import { testData } from '@/utils/unit-tests/test-data'
import { useStakingPoolsAddress } from '@/src/hooks/contracts/useStakingPoolsAddress'

describe('useClaimsProcessorAddress', () => {
  mockFn.utilsWeb3.getProviderOrSigner()
  mockFn.sdk.registry.StakingPools.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockFn.useWeb3React(() => ({ account: null }))
    mockFn.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useStakingPoolsAddress)

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockFn.useWeb3React()
    mockFn.useNetwork()

    const { result } = await renderHookWrapper(
      useStakingPoolsAddress,
      [],
      true
    )

    expect(result).toBe(testData.poolInfo.info.stakingPoolsContractAddress)
  })
})
