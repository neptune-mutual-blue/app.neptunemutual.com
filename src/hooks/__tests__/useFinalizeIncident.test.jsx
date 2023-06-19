import { useFinalizeIncident } from '@/src/hooks/useFinalizeIncident'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useFinalizeIncident', () => {
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useAuthValidation()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.useErrorNotifier()
  mockHooksOrMethods.useTxPoster()
  mockSdk.registry.Resolution.getInstance()

  const args = [
    {
      coverKey:
        '0x7072696d65000000000000000000000000000000000000000000000000000000',
      productKey:
        '0x6161766500000000000000000000000000000000000000000000000000000000',
      incidentDate: new Date().getTime()
    }
  ]

  test('should return correct data ', async () => {
    const { result } = await renderHookWrapper(useFinalizeIncident, args)

    expect(typeof result.finalize).toBe('function')
    expect(result.finalizing).toBe(false)
  })

  test('shoudl be able to execute the finalize function', async () => {
    const { result, act } = await renderHookWrapper(useFinalizeIncident, args)

    await act(async () => {
      await result.finalize()
    })
  })

  test('shoudl return if no networkId or account in finalize function', async () => {
    mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
    mockHooksOrMethods.useWeb3React(() => { return { account: null } })

    const { result, act } = await renderHookWrapper(useFinalizeIncident, args)

    await act(async () => {
      await result.finalize(jest.fn())
    })

    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
  })

  describe('Edge cases coverage', () => {
    test('shoudl use empty bytes32 if no product key provided', async () => {
      const { result, act } = await renderHookWrapper(useFinalizeIncident, [
        { ...args[0], productKey: '' }
      ])

      await act(async () => {
        await result.finalize(jest.fn())
      })
    })

    test('shoudl return if error in writing to contract', async () => {
      mockHooksOrMethods.useTxPoster(() => {
        return {
          ...testData.txPoster,
          writeContract: null
        }
      })

      const { result, act } = await renderHookWrapper(
        useFinalizeIncident,
        args
      )

      await act(async () => {
        await result.finalize(jest.fn())
      })
      expect(testData.errorNotifier.notifyError).toHaveBeenCalled()
    })
  })
})
