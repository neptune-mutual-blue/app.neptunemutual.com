import { useFetch } from '@/src/hooks/useFetch'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useFetch', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.log()

  test('should return default hook result', async () => {
    const { result } = await renderHookWrapper(useFetch, ['fetch client data'])

    expect(typeof result).toEqual('function')
  })

  test('should return correct data on success', async () => {
    const mockData = { data: 'This is success response!' }
    mockGlobals.fetch(true, undefined, mockData)

    const { result, act } = await renderHookWrapper(useFetch, [
      'fetch client data'
    ])
    await act(async () => {
      const response = await result()
      expect(response).toEqual(mockData)
    })

    mockGlobals.fetch().unmock()
  })

  test('should log the error if request aborted', async () => {
    const mockData = { message: 'The user aborted a request' }
    mockGlobals.fetch(false, undefined, mockData)
    mock()

    const { result, act } = await renderHookWrapper(useFetch, [
      'fetch client data'
    ])
    await act(async () => {
      await result()
    })
    expect(mockFunction).toHaveBeenCalledWith(
      'Aborted Request: fetch client data'
    )

    mockGlobals.fetch().unmock()
    restore()
  })

  test('should throw the error if request not aborted but error raised', async () => {
    const mockData = { message: 'Invalid metadata' }
    mockGlobals.fetch(false, undefined, mockData)

    const { result, act } = await renderHookWrapper(useFetch, [
      'fetch client data'
    ])

    let errorObject
    await act(async () => {
      try {
        await result()
      } catch (e) {
        errorObject = e
      }
    })
    expect(errorObject).toBeDefined()

    mockGlobals.fetch().unmock()
  })
})
