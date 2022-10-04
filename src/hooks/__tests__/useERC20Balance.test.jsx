import { useERC20Balance } from '@/src/hooks/useERC20Balance'
import { testData } from '@/utils/unit-tests/test-data'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useERC20Balance', () => {
  mockFn.useNetwork()
  mockFn.useWeb3React()
  mockFn.useTxPoster()
  const { mock, mockFunction } = mockFn.console.error()
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
      mockFn.sdk.registry.IERC20.getInstance(true)

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      await renderHookWrapper(useERC20Balance, args)
    })

    test('returned error from contractRead function', async () => {
      mockFn.sdk.registry.IERC20.getInstance()
      mockFn.useTxPoster(() => ({
        ...testData.txPoster,
        contractRead: () => Promise.reject(new Error('Something went wrong'))
      }))

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      await renderHookWrapper(useERC20Balance, args)
      expect(mockFunction).toHaveBeenCalled()
    })

    test('returned no result from contractRead function', async () => {
      mockFn.useTxPoster(() => ({
        ...testData.txPoster,
        contractRead: () => Promise.resolve(null)
      }))

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      await renderHookWrapper(useERC20Balance, args)
    })

    test('rerendering with no tokenAddress', async () => {
      mockFn.useTxPoster()

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      const { rerender, act } = await renderHookWrapper(useERC20Balance, args)

      await act(async () => {
        await rerender([''])
      })
    })

    test('returned no result from contractRead function when refetching', async () => {
      mockFn.useTxPoster(() => ({
        ...testData.txPoster,
        contractRead: () => Promise.resolve(null)
      }))

      const args = ['0x03b4658fA53bdaC8cedd7C4Cec3E41Ca9777dB84']
      const { result, act } = await renderHookWrapper(useERC20Balance, args)

      await act(async () => {
        await result.refetch()
      })
    })
  })
})
