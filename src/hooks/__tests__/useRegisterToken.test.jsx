import { useRegisterToken } from '@/src/hooks/useRegisterToken'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useRegisterToken', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()
  const {
    mock: mockLog,
    mockFunction: mockFunctionLog,
    restore: restoreLog
  } = mockGlobals.console.log()
  mockGlobals.location()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.useWeb3React()

  const fnArgs = ['0x1254i34345', 'NPM']

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useRegisterToken)
    expect(typeof result.register).toEqual('function')
  })

  test('should be able to execute register function', async () => {
    const { result, act } = await renderHookWrapper(useRegisterToken)
    mockLog()

    console.log(window.location)

    // expect(false).toBe(true)

    await act(async () => {
      console.log(window.location)
      await result.register(...fnArgs)
    })
    expect(mockFunctionLog).toHaveBeenCalled()

    restoreLog()
  })

  test('should call console.error if error occurred', async () => {
    mock()
    mockHooksOrMethods.registerToken(false)

    const { result, act } = await renderHookWrapper(useRegisterToken)

    await act(async () => {
      await result.register(fnArgs[0])
    })
    expect(mockFunction).toHaveBeenCalled()

    restore()
  })

  test('should return if no networkId or account', async () => {
    mockHooksOrMethods.useNetwork(() => ({ networkId: null }))
    mockHooksOrMethods.useWeb3React(() => ({ account: null }))

    const { result, act } = await renderHookWrapper(useRegisterToken)

    await act(async () => {
      await result.register(...fnArgs)
    })

    mockHooksOrMethods.useNetwork()
    mockHooksOrMethods.useWeb3React()
  })
})
