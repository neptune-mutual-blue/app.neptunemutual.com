// import { useIfWhitelisted } from '@/src/hooks/useIfWhitelisted'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

describe('useIfWhitelisted', () => {
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useErrorNotifier()
  mockSdk.registry.Cover.getInstance()

  // const args = [
  //   {
  //     coverKey:
  //       '0x7072696d65000000000000000000000000000000000000000000000000000000'
  //   }
  // ]

  // test('should return isUserWhitelisted true if transaction success', async () => {
  //   const { result } = await renderHookWrapper(useIfWhitelisted, args, true)

  //   expect(result.isUserWhitelisted).toBe(true)
  // })

  test('should return if no networkId or account', async () => {
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))

    // const { result } = await renderHookWrapper(useIfWhitelisted, args)

    // expect(result.isUserWhitelisted).toBe(false)

    mockHooksOrMethods.useWeb3React()
    mockHooksOrMethods.useNetwork()
  })

  test('should return isUserWhitelisted false if no tx result received', async () => {
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: jest.fn((arg) => {
        arg?.onTransactionResult?.(null)
        arg?.onRetryCancel?.()
        arg?.onError?.()
      })
    }))

    // const { result } = await renderHookWrapper(useIfWhitelisted, args)

    // expect(result.isUserWhitelisted).toBe(false)
  })

  test('should execute notifyError function if error occurred', async () => {
    mockHooksOrMethods.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null
    }))

    // await renderHookWrapper(useIfWhitelisted, args)

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
  })
})
