import { useFetchReport } from '@/src/hooks/useFetchReport'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'

describe('useFetchReport', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()

  mockHooksOrMethods.getGraphURL()
  mockHooksOrMethods.getNetworkId()

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
    const mockData = {
      data: { incidentReport: { id: 1, reportedOn: new Date().getTime() } }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useFetchReport, args, true)

    expect(result.data).toEqual(mockData.data.incidentReport)
    expect(result.loading).toBe(false)
    expect(typeof result.refetch).toBe('function')

    mockGlobals.fetch().unmock()
  })

  test('should log error if api error occurs', async () => {
    mockGlobals.fetch(false)
    mock()

    await renderHookWrapper(useFetchReport, args, true)
    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })

  test('should execute the refetch function', async () => {
    const mockData = {
      data: { incidentReport: { id: 1, reportedOn: new Date().getTime() } }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result, act } = await renderHookWrapper(useFetchReport, args, true)

    await act(async () => {
      await result.refetch()
    })

    mockGlobals.fetch().unmock()
  })
})
