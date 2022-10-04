import { useIfWhitelisted } from '@/src/hooks/useIfWhitelisted'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useIfWhitelisted', () => {
  mockFn.useWeb3React()
  mockFn.useNetwork()
  mockFn.useTxPoster()
  mockFn.useErrorNotifier()
  mockFn.sdk.registry.Cover.getInstance()

  const args = [
    {
      coverKey:
        '0x7072696d65000000000000000000000000000000000000000000000000000000'
    }
  ]

  test('should return isUserWhitelisted true if transaction success', async () => {
    const { result } = await renderHookWrapper(useIfWhitelisted, args, true)

    expect(result.isUserWhitelisted).toBe(true)
  })

  test('should return if no networkId or account', async () => {
    mockFn.useWeb3React(() => ({ account: null }))
    mockFn.useNetwork(() => ({ networkId: null }))

    const { result } = await renderHookWrapper(useIfWhitelisted, args)

    expect(result.isUserWhitelisted).toBe(false)

    mockFn.useWeb3React()
    mockFn.useNetwork()
  })

  test('should return isUserWhitelisted false if no tx result received', async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: jest.fn((arg) => {
        arg?.onTransactionResult?.(null)
        arg?.onRetryCancel?.()
        arg?.onError?.()
      })
    }))

    const { result } = await renderHookWrapper(useIfWhitelisted, args)

    expect(result.isUserWhitelisted).toBe(false)
  })

  test('should execute notifyError function if error occurred', async () => {
    mockFn.useTxPoster(() => ({
      ...testData.txPoster,
      writeContract: null
    }))

    await renderHookWrapper(useIfWhitelisted, args)

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
  })
})
