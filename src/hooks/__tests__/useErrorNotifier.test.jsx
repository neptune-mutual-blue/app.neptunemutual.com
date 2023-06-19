import { getErrorMessage } from '@/src/helpers/tx'
import { defaultArgs, useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { testData } from '@/utils/unit-tests/test-data'
import { ERROR_TOAST_TIME } from '@/src/config/toast'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useErrorNotifier', () => {
  mockHooksOrMethods.useToast()
  const { mock, mockFunction } = mockGlobals.console.error()
  mock()

  const args = [{ duration: 5000 }]

  test('should return default value', async () => {
    const { result, unmount } = await renderHookWrapper(useErrorNotifier, args)

    expect(typeof result.notifyError).toBe('function')

    unmount()
  })

  test('should execute notifyError function', async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, args)

    act(() => {
      result.notifyError({})
    })
  })

  test('should print the error', async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, args)

    act(() => {
      result.notifyError({ data: 'Error occurred!' })
    })
    expect(mockFunction).toHaveBeenCalledWith({ data: 'Error occurred!' })
  })

  test('should call the toast.pushError function', async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, args)

    act(() => {
      result.notifyError({ data: 'Error occurred!' })
    })

    const pushErrorArgs = {
      title: 'Error occurred!',
      message: getErrorMessage({ error: 'Error occurred!' }),
      lifetime: args[0].duration
    }

    expect(testData.toast.pushError).toHaveBeenCalledWith(pushErrorArgs)
  })

  test('should use default argument if not provided', async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier)

    act(() => {
      result.notifyError({})
    })

    const pushErrorArgs = {
      title: 'Something went wrong',
      message: getErrorMessage({}),
      lifetime: defaultArgs.duration
    }

    expect(testData.toast.pushError).toHaveBeenCalledWith(pushErrorArgs)
  })

  test('should use default duration if not provided', async () => {
    const { result, act } = await renderHookWrapper(useErrorNotifier, [{}])

    act(() => {
      result.notifyError({})
    })

    const pushErrorArgs = {
      title: 'Something went wrong',
      message: getErrorMessage({}),
      lifetime: ERROR_TOAST_TIME
    }

    expect(testData.toast.pushError).toHaveBeenCalledWith(pushErrorArgs)
  })
})
