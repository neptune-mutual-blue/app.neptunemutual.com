import { useResolveIncident } from '@/src/hooks/useResolveIncident'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useResolveIncident', () => {
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useAuthValidation()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useErrorNotifier()
  mockSdk.registry.Resolution.getInstance()

  const args = [
    {
      coverKey:
        '0x7072696d65000000000000000000000000000000000000000000000000000000',
      productKey:
        '0x62616c616e636572000000000000000000000000000000000000000000000000',
      incidentDate: new Date().setDate(1)
    }
  ]

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useResolveIncident, args)

    expect(typeof result.resolve).toEqual('function')
    expect(typeof result.emergencyResolve).toEqual('function')
    expect(result.resolving).toEqual(false)
    expect(result.emergencyResolving).toEqual(false)
  })

  test('should be able to execute resolve function', async () => {
    const { result, act } = await renderHookWrapper(useResolveIncident, args)
    await act(async () => {
      await result.resolve()
    })

    expect(testData.txPoster.writeContract).toHaveBeenCalled()
  })

  test('should be able to execute emergencyResolve function', async () => {
    const { result, act } = await renderHookWrapper(useResolveIncident, args)
    const fnArgs = ['cancel', jest.fn()]
    await act(async () => {
      await result.emergencyResolve(...fnArgs)
    })

    expect(testData.txPoster.writeContract).toHaveBeenCalled()
  })

  test('should run auth function if no network or account in resolve function', async () => {
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })

    const { result, act } = await renderHookWrapper(useResolveIncident, args)
    await act(async () => {
      await result.resolve()
    })

    expect(testData.authValidation.requiresAuth).toHaveBeenCalled()

    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
  })

  test('should call notifyError if error raised in resolve function', async () => {
    mockHooksOrMethods.useTxPoster(() => {
      return {
        ...testData.txPoster,
        writeContract: null
      }
    })

    const { result, act } = await renderHookWrapper(useResolveIncident, [
      { ...args[0], productKey: '' }
    ])
    await act(async () => {
      await result.resolve()
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockHooksOrMethods.useTxPoster()
  })

  test('should run auth function if no network or account in emergencyResolve function', async () => {
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })

    const { result, act } = await renderHookWrapper(useResolveIncident, args)
    await act(async () => {
      await result.emergencyResolve('cancel')
    })

    expect(testData.authValidation.requiresAuth).toHaveBeenCalled()

    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
  })

  test('should call notifyError if error raised in emergencyResolve function', async () => {
    mockHooksOrMethods.useTxPoster(() => {
      return {
        ...testData.txPoster,
        writeContract: null
      }
    })

    const { result, act } = await renderHookWrapper(useResolveIncident, [
      { ...args[0], productKey: '' }
    ])
    const fnArgs = ['cancel', jest.fn()]
    await act(async () => {
      await result.emergencyResolve(...fnArgs)
    })

    expect(testData.errorNotifier.notifyError).toHaveBeenCalled()

    mockHooksOrMethods.useTxPoster()
  })

  test('should be able to execute emergencyResolve function without success function', async () => {
    const { result, act } = await renderHookWrapper(useResolveIncident, args)
    const fnArgs = ['cancel']
    await act(async () => {
      await result.emergencyResolve(...fnArgs)
    })

    expect(testData.txPoster.writeContract).toHaveBeenCalled()
  })
})
