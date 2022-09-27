import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useRegisterToken', () => {
  const { mock, mockFunction, restore } = mockFn.console.error()
  const {
    mock: mockLog,
    mockFunction: mockFunctionLog,
    restore: restoreLog
  } = mockFn.console.log()
  mockFn.useNetwork()
  mockFn.useWeb3React()

  const fnArgs = ['0x1254i34345', 'NPM']

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useRegisterToken)
    expect(typeof result.register).toEqual('function')
  })

  test('should be able to execute register function', async () => {
    const { result, act } = await renderHookWrapper(useRegisterToken)
    mockLog()

    await act(async () => {
      await result.register(...fnArgs)
    })
    expect(mockFunctionLog).toHaveBeenCalled()

    restoreLog()
  })

  test('should call console.error if error occured', async () => {
    mock()
    mockFn.registerToken(false)

    const { result, act } = await renderHookWrapper(useRegisterToken)

    await act(async () => {
      await result.register(fnArgs[0])
    })
    expect(mockFunction).toHaveBeenCalled()

    restore()
  })

  test('should return if no networkId or account', async () => {
    mockFn.useNetwork(() => ({ networkId: null }))
    mockFn.useWeb3React(() => ({ account: null }))

    const { result, act } = await renderHookWrapper(useRegisterToken)

    await act(async () => {
      await result.register(...fnArgs)
    })

    mockFn.useNetwork()
    mockFn.useWeb3React()
  })
})
