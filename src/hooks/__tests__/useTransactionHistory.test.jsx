import { useTransactionHistory } from '@/src/hooks/useTransactionHistory'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { testData } from '@/utils/unit-tests/test-data'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useTransactionHistory', () => {
  mockHooksOrMethods.useWeb3React(() => {
    return {
      ...testData.account,
      library: { provider: true }
    }
  })
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useTxToast()
  mockHooksOrMethods.utilsWeb3.getProviderOrSigner()

  test('should execute the hook properly ', async () => {
    mockHooksOrMethods.TransactionHistory.callback()
    await renderHookWrapper(useTransactionHistory)
    mockHooksOrMethods.TransactionHistory.callback(false)
  })

  describe('Edge cases coverage', () => {
    test('should return if no netowrkId, account ', async () => {
      mockHooksOrMethods.useNetwork(() => { return { networkId: null } })
      mockHooksOrMethods.useWeb3React(() => {
        return {
          account: null,
          library: null
        }
      })

      await renderHookWrapper(useTransactionHistory)
      mockHooksOrMethods.useNetwork()
      mockHooksOrMethods.useWeb3React(() => {
        return {
          ...testData.account,
          library: { provider: true }
        }
      })
    })

    test('should return if no provider ', async () => {
      mockHooksOrMethods.utilsWeb3.getProviderOrSigner(() => {
        return {
          ...testData.providerOrSigner,
          provider: null
        }
      })

      await renderHookWrapper(useTransactionHistory)
      mockHooksOrMethods.utilsWeb3.getProviderOrSigner()
    })
  })
})
