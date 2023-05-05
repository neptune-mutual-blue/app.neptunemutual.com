import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { useStakingPoolsAddress } from '@/src/hooks/contracts/useStakingPoolsAddress'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useClaimsProcessorAddress', () => {
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
  mockSdk.registry.StakingPools.getAddress()

  test('while fetching w/o account and networkId', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useStakingPoolsAddress)

    expect(result).toBeNull()
  })

  test('while fetching successful', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()

    const { result } = await renderHookWrapper(
      useStakingPoolsAddress,
      [],
      true
    )

    expect(result).toBe(testData.poolInfo.info.stakingPoolsContractAddress)
  })
})
