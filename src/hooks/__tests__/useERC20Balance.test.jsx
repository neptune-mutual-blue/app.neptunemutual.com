import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { mockSdk } from '@/utils/unit-tests/mock-sdk'
import { testData } from '@/utils/unit-tests/test-data'

jest.mock('@neptunemutual/sdk')

describe('useERC20Balance', () => {
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()
  mockHooksOrMethods.useTxPoster()
  const { mock, mockFunction } = mockGlobals.console.error()
  mock()

  test('should return default value', async () => {
    const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
    const { result, unmount } = await renderHookWrapper(useERC20Balance, args)

    expect(result.balance).toEqual('0')
    expect(result.loading).toEqual(false)

    unmount()
  })

  test('should run refetch function without fail', async () => {
    const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
    mockSdk.registry.IERC20.getInstance()
    const { result, act } = await renderHookWrapper(
      useERC20Balance,
      args,
      true
    )

    act(async () => {
      await result.refetch()
    })
    expect(result.balance).toEqual('100')
  })

  describe('Covering edge cases', () => {
    test('no tokenAddress provided', async () => {
      const args = ['']
      await renderHookWrapper(useERC20Balance, args)
    })

    test('no token instance found', async () => {
      mockSdk.registry.IERC20.getInstance(true)

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      await renderHookWrapper(useERC20Balance, args)
    })

    test('returned error from contractRead function', async () => {
      mockSdk.registry.IERC20.getInstance()
      mockHooksOrMethods.useTxPoster(() => {
        return {
          ...testData.txPoster,
          contractRead: () => { return Promise.reject(new Error('Something went wrong')) }
        }
      })

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      await renderHookWrapper(useERC20Balance, args)
      expect(mockFunction).toHaveBeenCalled()
    })

    test('returned no result from contractRead function', async () => {
      mockHooksOrMethods.useTxPoster(() => {
        return {
          ...testData.txPoster,
          contractRead: () => { return Promise.resolve(null) }
        }
      })

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      await renderHookWrapper(useERC20Balance, args)
    })

    test('rerendering with no tokenAddress', async () => {
      mockHooksOrMethods.useTxPoster()

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      const { rerender, act } = await renderHookWrapper(useERC20Balance, args)

      await act(async () => {
        await rerender([''])
      })
    })

    test('returned no result from contractRead function when refetching', async () => {
      mockHooksOrMethods.useTxPoster(() => {
        return {
          ...testData.txPoster,
          contractRead: () => { return Promise.resolve(null) }
        }
      })

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      const { result, act } = await renderHookWrapper(useERC20Balance, args)

      await act(async () => {
        await result.refetch()
      })
    })
  })
})
