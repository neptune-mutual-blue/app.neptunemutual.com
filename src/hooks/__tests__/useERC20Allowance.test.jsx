import { useERC20Allowance } from '@/src/hooks/useERC20Allowance'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useERC20Allowance', () => {
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useErrorNotifier()
  mockHooksOrMethods.useTxPoster()
  mockHooksOrMethods.useUnlimitedApproval()
  mockHooksOrMethods.useAuthValidation()

  const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
  const spender = '0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468'
  const fnArgs = [
    '0x5B73fd777f535C5A47CC6eFb45d0cc66308B1468',
    '1000',
    {
      onTransactionResult: jest.fn(),
      onRetryCancel: jest.fn(),
      onError: jest.fn()
    }
  ]

  test('should return default value', async () => {
    const { result, unmount } = await renderHookWrapper(
      useERC20Allowance,
      args
    )

    expect(result.allowance).toEqual('0')
    expect(result.loading).toEqual(false)

    unmount()
  })

  test('should run refetch function without fail', async () => {
    const { result, act } = await renderHookWrapper(useERC20Allowance, args)

    await act(async () => {
      await result.refetch(spender)
    })
    // expect(result.allowance).toEqual("100");
  })

  test('should run approve function', async () => {
    const { result, act } = await renderHookWrapper(useERC20Allowance, args)

    await act(async () => {
      await result.approve(...fnArgs)
    })
    // expect(result.allowance).toEqual("100");
  })

  describe('covering edge cases', () => {
    test('testing conditions for no token addresss for refetch', async () => {
      const { result, act } = await renderHookWrapper(useERC20Allowance, [''])

      await act(async () => {
        await result.refetch(spender)
      })
    })

    test('should return when no spender provided in refetch function', async () => {
      const { result, act } = await renderHookWrapper(useERC20Allowance, args)

      await act(async () => {
        await result.refetch()
      })
    })

    test('should return when token instance is undefined in refetch function', async () => {
      mockSdk.registry.IERC20.getInstance(true)
      const { result, act } = await renderHookWrapper(useERC20Allowance, args)

      await act(async () => {
        await result.refetch(spender)
      })

      mockSdk.registry.IERC20.getInstance()
    })

    test('should return when error in fetchAllowance function', async () => {
      mockHooksOrMethods.useTxPoster(() => ({
        ...testData.txPoster,
        contractRead: () => Promise.reject(new Error('Error in contractRead'))
      }))
      const { result, act } = await renderHookWrapper(useERC20Allowance, args)

      await act(async () => {
        await result.refetch(spender)
      })

      mockHooksOrMethods.useTxPoster()
    })

    test('should set allowance to 0 when no tokenaddress', async () => {
      const { result, act, rerender } = await renderHookWrapper(
        useERC20Allowance,
        args
      )

      await act(async () => {
        await result.refetch(spender)
      })

      await act(async () => {
        rerender([''])
      })
    })

    test('should return when no allowance returned from contractRead function', async () => {
      mockHooksOrMethods.useTxPoster(() => ({
        ...testData.txPoster,
        contractRead: () => Promise.resolve(null)
      }))

      const { result, act } = await renderHookWrapper(useERC20Allowance, args)

      await act(async () => {
        result.refetch(spender)
      })
      mockHooksOrMethods.useTxPoster()
    })

    test('testing conditions for no token addresss for approve function', async () => {
      const { result, act } = await renderHookWrapper(useERC20Allowance, [''])

      await act(async () => {
        try {
          await result.approve(...fnArgs)
        } catch (err) {
          expect(err.message).toBe('Could not approve')
        }
      })
    })

    test('testing for no token instance for approve function', async () => {
      mockSdk.registry.IERC20.getInstance(true)

      const { result, act } = await renderHookWrapper(useERC20Allowance, args)

      await act(async () => {
        await result.approve(...fnArgs)
      })

      mockSdk.registry.IERC20.getInstance()
    })
  })
})
