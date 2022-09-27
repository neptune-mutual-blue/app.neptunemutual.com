import { useFetchReportsByKeyAndDate } from '@/src/hooks/useFetchReportsByKeyAndDate'
import { mockFn, renderHookWrapper } from '@/utils/unit-tests/test-mockup-fn'

describe('useFetchReportsByKeyAndDate', () => {
  const { mock, mockFunction, restore } = mockFn.console.error()

  mockFn.getGraphURL()
  mockFn.getNetworkId()

  const args = [
    {
      coverKey:
        '0x7072696d65000000000000000000000000000000000000000000000000000000',
      incidentDate: new Date().getTime()
    }
  ]

  test('should return correct data ', async () => {
    const mockData = {
      data: { incidentReports: [{ id: 1, reportedOn: new Date().getTime() }] }
    }
    mockFn.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(
      useFetchReportsByKeyAndDate,
      args,
      true
    )

    expect(result.data).toEqual(mockData.data.incidentReports)
    expect(result.loading).toBe(false)

    mockFn.fetch().unmock()
  })

  test('should return if coverkey & incident dat not provided', async () => {
    const mockData = {
      data: { incidentReports: [{ id: 1, reportedOn: new Date().getTime() }] }
    }
    mockFn.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useFetchReportsByKeyAndDate, [
      {}
    ])

    expect(result.data).toEqual([])

    mockFn.fetch().unmock()
  })

  test('should log the error if error occured', async () => {
    mockFn.fetch(false)
    mock()

    await renderHookWrapper(useFetchReportsByKeyAndDate, args, true)

    expect(mockFunction).toHaveBeenCalled()

    mockFn.fetch().unmock()
    restore()
  })
})
