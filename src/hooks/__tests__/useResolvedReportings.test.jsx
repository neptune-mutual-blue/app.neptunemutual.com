import { useResolvedReportings } from '@/src/hooks/useResolvedReportings'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useResolvedReportings', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()
  mockHooksOrMethods.useNetwork()
  mockHooksOrMethods.getGraphURL()

  test('should return default hook result', async () => {
    mockGlobals.fetch()

    const { result } = await renderHookWrapper(useResolvedReportings)

    expect(typeof result.handleShowMore).toEqual('function')
    expect(result.hasMore).toEqual(true)
    expect(result.data.incidentReports).toEqual([])
    expect(result.loading).toEqual(false)
  })

  test('should return correct data as returned from api', async () => {
    const mockData = { data: { incidentReports: [{ id: 1 }, { id: 2 }] } }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useResolvedReportings, [], true)

    expect(result.data.incidentReports).toEqual(mockData.data.incidentReports)
  })

  test('should execute the handleShowMore function', async () => {
    mockGlobals.fetch()

    const { result, act } = await renderHookWrapper(useResolvedReportings)
    await act(async () => {
      await result.handleShowMore()
    })
  })

  test('should not set hasMore to false if not lastpage', async () => {
    const mockData = {
      data: {
        incidentReports: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
          { id: 5 },
          { id: 6 }
        ]
      }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useResolvedReportings, [], true)

    expect(result.hasMore).toEqual(true)
  })

  test('should log error if error is raised', async () => {
    mock()
    mockGlobals.fetch(false)

    await renderHookWrapper(useResolvedReportings, [], true)

    expect(mockFunction).toHaveBeenCalled()

    restore()
  })
})
