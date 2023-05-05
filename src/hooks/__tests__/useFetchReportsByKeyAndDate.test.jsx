import { useFetchReportsByKeyAndDate } from '@/src/hooks/useFetchReportsByKeyAndDate'
import { mockGlobals } from '@/utils/unit-tests/mock-globals'
import { mockHooksOrMethods } from '@/utils/unit-tests/mock-hooks-and-methods'
import { renderHookWrapper } from '@/utils/unit-tests/helpers'

describe('useFetchReportsByKeyAndDate', () => {
  const { mock, mockFunction, restore } = mockGlobals.console.error()

  mockHooksOrMethods.getGraphURL()
  mockHooksOrMethods.getNetworkId()

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
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(
      useFetchReportsByKeyAndDate,
      args,
      true
    )

    expect(result.data).toEqual(mockData.data.incidentReports)
    expect(result.loading).toBe(false)

    mockGlobals.fetch().unmock()
  })

  test('should return if coverkey & incident dat not provided', async () => {
    const mockData = {
      data: { incidentReports: [{ id: 1, reportedOn: new Date().getTime() }] }
    }
    mockGlobals.fetch(true, undefined, mockData)

    const { result } = await renderHookWrapper(useFetchReportsByKeyAndDate, [
      {}
    ])

    expect(result.data).toEqual([])

    mockGlobals.fetch().unmock()
  })

  test('should log the error if error occurred', async () => {
    mockGlobals.fetch(false)
    mock()

    await renderHookWrapper(useFetchReportsByKeyAndDate, args, true)

    expect(mockFunction).toHaveBeenCalled()

    mockGlobals.fetch().unmock()
    restore()
  })
})
