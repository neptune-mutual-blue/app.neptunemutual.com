import { useLocalStorage } from '@/src/hooks/useLocalStorage'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { originalProcess } from '@/utils/unit-tests/test-utils'

describe('useLocalStorage', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.log()

  const args = ['stored-key', '{"value": "Initial value"}']

  test('should return default data', async () => {
    const { result } = await renderHookWrapper(useLocalStorage, args)

    expect(result[0]).toEqual(args[1])
    expect(typeof result[1]).toBe('function')
  })

  test('should return undefined if not browser', async () => {
    global.process = { ...originalProcess, browser: false }

    const { result } = await renderHookWrapper(useLocalStorage, args)
    expect(result[0]).toEqual(undefined)

    global.process = { ...originalProcess, browser: true }
  })

  test('should return stored data if available', async () => {
    const storedData = ['stored-key', '{"value": "New Value"}']
    localStorage.setItem(storedData[0], storedData[1])
    const { result } = await renderHookWrapper(useLocalStorage, args)

    expect(result[0]).toEqual(JSON.parse(storedData[1]))
  })

  test('should log error if error occurs', async () => {
    mock()
    const storedData = ['stored-key', '{value: "New Value"}']
    localStorage.setItem(storedData[0], storedData[1])

    const { result } = await renderHookWrapper(useLocalStorage, args)
    expect(result[0]).toEqual(args[1])
    expect(mockFunction).toHaveBeenCalled()

    restore()
  })

  test('should be able to run setValue method', async () => {
    const { act, renderHookResult, result } = await renderHookWrapper(
      useLocalStorage,
      args
    )

    const newValue = '{"value": "Using setValue method"}'
    await act(async () => {
      await result[1](newValue)
    })
    expect(renderHookResult.current[0]).toEqual(newValue)
  })

  test('should return undefined if not browser in setValue method', async () => {
    global.process = { ...originalProcess, browser: false }

    const { result, act, renderHookResult } = await renderHookWrapper(
      useLocalStorage,
      args
    )
    await act(async () => {
      const newValue = '{"value": "Using setValue method"}'
      await result[1](newValue)
    })
    expect(renderHookResult.current[0]).toBeUndefined()

    global.process = { ...originalProcess, browser: true }
  })

  test('should log error if error thrown in setValue method', async () => {
    mock()
    const setItem = window.localStorage.setItem
    window.localStorage.setItem = null

    const { result, act } = await renderHookWrapper(useLocalStorage, args)
    await act(async () => {
      const newValue = { a: 123 }
      await result[1](newValue)
    })
    expect(mockFunction).toHaveBeenCalled()

    restore()
    window.localStorage.setItem = setItem
  })

  test('should successfully set value if function provided', async () => {
    const { result, act, renderHookResult } = await renderHookWrapper(
      useLocalStorage,
      args
    )
    await act(async () => {
      const newValue = () => JSON.stringify({ a: 1 })
      await result[1](newValue)
    })
    expect(renderHookResult.current[0]).toEqual(JSON.stringify({ a: 1 }))
  })
})
