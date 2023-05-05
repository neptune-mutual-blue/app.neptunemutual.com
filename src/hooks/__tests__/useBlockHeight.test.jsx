import { useBlockHeight } from '../useBlockHeight'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useBlockHeight', () => {
  test('should not receive block height', async () => {
    mockHooksOrMethods.useWeb3React(() => ({
      account: null
    }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))
    mockHooksOrMethods.utilsWeb3.getProviderOrSigner(() => null)

    const { result } = await renderHookWrapper(useBlockHeight)

    expect(result).toEqual(1)
  })

  test('should receive block height', async () => {
    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.utilsWeb3.getProviderOrSigner(
      () => testData.providerOrSignerGetBlockNumber
    )

    const { result } = await renderHookWrapper(useBlockHeight, [], true)

    expect(result).toEqual(100)
  })
})
