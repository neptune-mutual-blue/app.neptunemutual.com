import { useResolvedReportings } from '@/src/hooks/useResolvedReportings'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useResolvedReportings', () => {
  const { mock, mockFunction, restore } = mockFn.console.error()
  mockFn.useNetwork()
  mockFn.getGraphURL()

  test('should return default hook result', async () => {
    mockFn.fetch()

    const { result } = await renderHookWrapper(useResolvedReportings)

    expect(typeof result.handleShowMore).toEqual('function')
    expect(result.hasMore).toEqual(true)
    expect(result.data.incidentReports).toEqual([])
    expect(result.loading).toEqual(false)
  })

  test('should return correct data as returned from api', async () => {
    const mockData = { data: { incidentReports: [{ id: 1 }, { id: 2 }] } }
    mockFn.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useResolvedReportings, [], true)

    expect(result.data.incidentReports).toEqual(mockData.data.incidentReports)
  })

  test('should execute the handleShowMore function', async () => {
    mockFn.fetch()

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
    mockFn.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useResolvedReportings, [], true)

    expect(result.hasMore).toEqual(true)
  })

  test('should log error if error is raised', async () => {
    mock()
    mockFn.fetch(false)

    await renderHookWrapper(useResolvedReportings, [], true)

    expect(mockFunction).toHaveBeenCalled()

    restore()
  })
})
